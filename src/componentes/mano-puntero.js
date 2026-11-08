// MANO PUNTERO - QUEST 3 SIN MANDOS (módulo 2.5, DT-034)
//
// Componente A-Frame que va junto a hand-tracking-controls (de A-Frame):
//   <a-entity id="mano-derecha" hand-tracking-controls="hand: right" mano-puntero></a-entity>
// Las entidades de las manos van DENTRO del #jugador, como los mandos.
//
// Qué hace, cuando el Quest ve la mano (sin mandos):
//   - Dibuja un RAYO que sale de la mano y un punto donde toca algo.
//   - PELLIZCO (pulgar + índice) apuntando a algo interactivo (pieza,
//     mostrador, botón de la puerta...) → lo selecciona, como el gatillo:
//     se emite 'click' en ese elemento.
//   - PELLIZCO apuntando a otra cosa → aparece el arco del teletransporte;
//     al SOLTAR el pellizco se salta (usa el componente teletransporte).
//
// De dónde sale el rayo: no hay un "cañón" como en el mando, así que se usa
// la línea HOMBRO → MANO (como el puntero del propio menú del Quest): el
// hombro se estima bajo la cabeza y hacia el lado de la mano. El rayo
// arranca en el nudillo del índice, que se mueve poco al pellizcar.
//
// Coordenadas: hand-tracking-controls da las articulaciones en el espacio
// del visor, que es el espacio LOCAL del #jugador (igual que la cámara). Por
// eso se pasan al mundo con jugador.localToWorld(...).

const THREE = AFRAME.THREE;

const NUDILLO_INDICE = 6;   // índice de la articulación en WebXR (index-finger-phalanx-proximal)
const LARGO_RAYO = 4;       // m, alcance para seleccionar
const HOMBRO_ABAJO = 0.18;  // m bajo los ojos
const HOMBRO_LADO = 0.17;   // m hacia el lado de la mano

AFRAME.registerComponent('mano-puntero', {
  schema: {
    jugador: {type: 'selector', default: '#jugador'},
    camara: {type: 'selector', default: '#camara'},
    objetos: {type: 'string', default: '.interactivo'},
    color: {type: 'color', default: '#FFF4E6'}
  },

  init: function () {
    this.lado = this.el.getAttribute('hand-tracking-controls')?.hand === 'left' ? -1 : 1;

    this.origen = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.hombro = new THREE.Vector3();
    this.derechaCabeza = new THREE.Vector3();
    this.matriz = new THREE.Matrix4();
    this.raycaster = new THREE.Raycaster();
    this.raycaster.far = LARGO_RAYO;
    this.sobre = null;         // elemento interactivo al que se apunta
    this.pellizcoSalto = false;
    this.ejeZ = new THREE.Vector3(0, 0, 1);
    this.objetos = [];         // object3D de los elementos interactivos
    this.ultimaLista = -Infinity;

    this.crearRayo();

    this.alPellizcar = this.alPellizcar.bind(this);
    this.alSoltar = this.alSoltar.bind(this);
    this.el.addEventListener('pinchstarted', this.alPellizcar);
    this.el.addEventListener('pinchended', this.alSoltar);
  },

  remove: function () {
    this.el.removeEventListener('pinchstarted', this.alPellizcar);
    this.el.removeEventListener('pinchended', this.alSoltar);
    this.el.sceneEl.object3D.remove(this.rayo, this.punto);
  },

  // ¿Ve el Quest la mano en este fotograma?
  manoVisible: function () {
    const mano = this.el.components['hand-tracking-controls'];
    return !!(mano && mano.hasPoses && this.el.sceneEl.is('vr-mode'));
  },

  // Rellena origen y dirección del rayo (mundo). Devuelve false si no hay mano.
  // El teletransporte también la usa como "fuente" para su arco.
  obtenerRayo: function (origen, direccion) {
    if (!this.manoVisible()) return false;
    const mano = this.el.components['hand-tracking-controls'];
    const jugador = this.data.jugador.object3D;
    const camara = this.data.camara.object3D;

    // Nudillo del índice, en el espacio local del #jugador
    this.matriz.fromArray(mano.jointPoses, NUDILLO_INDICE * 16);
    origen.setFromMatrixPosition(this.matriz);

    // Hombro estimado (también en espacio local): bajo la cabeza y hacia el
    // lado de la mano, según hacia dónde mira la cabeza (solo en horizontal)
    this.derechaCabeza.set(1, 0, 0).applyQuaternion(camara.quaternion);
    this.derechaCabeza.y = 0;
    this.derechaCabeza.normalize();
    this.hombro.copy(camara.position);
    this.hombro.y -= HOMBRO_ABAJO;
    this.hombro.addScaledVector(this.derechaCabeza, HOMBRO_LADO * this.lado);

    // Al mundo (el #jugador puede estar movido, girado o elevado)
    jugador.updateMatrixWorld();
    jugador.localToWorld(origen);
    jugador.localToWorld(this.hombro);
    direccion.copy(origen).sub(this.hombro).normalize();
    return true;
  },

  tick: function (tiempo) {
    if (!this.obtenerRayo(this.origen, this.direccion)) {
      this.rayo.visible = false;
      this.punto.visible = false;
      this.cambiarSobre(null);
      // Si el visor pierde la mano a mitad de un salto, se cancela
      if (this.pellizcoSalto) {
        this.pellizcoSalto = false;
        const teletransporte = this.data.jugador.components.teletransporte;
        if (teletransporte?.fuente === this) teletransporte.dejarDeApuntar();
      }
      return;
    }

    // Mientras se apunta un salto con esta mano, el arco sustituye al rayo
    if (this.pellizcoSalto) {
      this.rayo.visible = false;
      this.punto.visible = false;
      return;
    }

    // ¿A qué elemento interactivo apunta?
    // (la lista se refresca una vez por segundo, no en cada fotograma)
    if (tiempo - this.ultimaLista > 1000) {
      this.objetos = [...this.el.sceneEl.querySelectorAll(this.data.objetos)].map((el) => el.object3D);
      this.ultimaLista = tiempo;
    }
    this.raycaster.set(this.origen, this.direccion);
    const visibles = this.objetos.filter((o) => o.visible);
    const impacto = this.raycaster.intersectObjects(visibles, true)[0];
    let elemento = null;
    if (impacto) {
      // Subir desde la malla tocada hasta la entidad .interactivo
      let o = impacto.object;
      while (o && !(o.el && o.el.matches(this.data.objetos))) o = o.parent;
      elemento = o?.el ?? null;
    }
    this.cambiarSobre(elemento);

    // Dibujo: el rayo llega hasta el impacto (o su largo máximo)
    const largo = impacto ? impacto.distance : 1.2;
    this.rayo.position.copy(this.origen);
    this.rayo.quaternion.setFromUnitVectors(this.ejeZ, this.direccion);
    this.rayo.scale.set(1, 1, largo);
    this.rayo.visible = true;
    this.punto.visible = !!impacto;
    if (impacto) this.punto.position.copy(impacto.point);
  },

  // Como el cursor de A-Frame: avisa al entrar y salir de un elemento
  cambiarSobre: function (elemento) {
    if (elemento === this.sobre) return;
    if (this.sobre) this.sobre.emit('mouseleave');
    this.sobre = elemento;
    if (elemento) elemento.emit('mouseenter');
  },

  alPellizcar: function () {
    if (!this.manoVisible()) return;
    if (this.sobre) {
      // Seleccionar: el mismo evento que el gatillo o el clic del ratón
      this.sobre.emit('click');
      return;
    }
    // Nada interactivo: apuntar un salto con el arco desde la mano
    const teletransporte = this.data.jugador.components.teletransporte;
    if (teletransporte && !teletransporte.apuntando) {
      this.pellizcoSalto = true;
      teletransporte.empezarAApuntar(this);
    }
  },

  alSoltar: function () {
    if (!this.pellizcoSalto) return;
    this.pellizcoSalto = false;
    const teletransporte = this.data.jugador.components.teletransporte;
    if (teletransporte && teletransporte.fuente === this) teletransporte.soltar();
  },

  // ---------- Dibujo del rayo (THREE.js directo) ----------

  crearRayo: function () {
    // Un cilindro fino de 1 m a lo largo de +Z; se estira con scale.z
    const geometria = new THREE.CylinderGeometry(0.002, 0.002, 1, 6);
    geometria.rotateX(Math.PI / 2);
    geometria.translate(0, 0, 0.5);
    const material = new THREE.MeshBasicMaterial({color: this.data.color, transparent: true, opacity: 0.6});
    this.rayo = new THREE.Mesh(geometria, material);
    this.rayo.visible = false;
    this.rayo.userData.ayuda = true;

    this.punto = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 6),
      new THREE.MeshBasicMaterial({color: this.data.color}));
    this.punto.visible = false;
    this.punto.userData.ayuda = true;

    this.el.sceneEl.object3D.add(this.rayo, this.punto);
  }
});
