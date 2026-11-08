// CLIC EN EL SUELO - PC Y MÓVIL (módulo 2.6, DT-034)
//
// Componente A-Frame en el #jugador:
//   <a-entity id="jugador" clic-en-suelo>
//
// Fuera de VR (navegador del PC o del móvil):
//   - CLIC (PC) o TOQUE (móvil) en el suelo → vas allí, con el mismo fundido
//     del teletransporte. Solo si el sitio es pisable (zonas-transitables) y
//     se ve desde donde estás: lo primero que toca el rayo debe ser el SUELO
//     (si es una pared o una peana, no hay salto).
//   - PC: al mover el ratón sobre el suelo se ve el anillo donde caerías.
//   - Arrastrar (ratón o dedo) sigue sirviendo para mirar alrededor: si el
//     puntero se mueve más de unos píxeles entre pulsar y soltar, no es un clic.
//   - Clic en algo interactivo (pieza, mostrador, botón): no se salta; de eso
//     se encarga el cursor de A-Frame como siempre.
// Dentro de VR no hace nada (allí están el joystick y las manos).

const THREE = AFRAME.THREE;

const MAXIMO_ARRASTRE = 8;    // px: más que esto entre pulsar y soltar = arrastre
const MAXIMA_DURACION = 600;  // ms: una pulsación más larga no es un clic
const ALTURA_SUELO = 0.08;    // m: un impacto por debajo de esto es "suelo"

AFRAME.registerComponent('clic-en-suelo', {
  schema: {
    interactivos: {type: 'string', default: '.interactivo'}
  },

  init: function () {
    this.raycaster = new THREE.Raycaster();
    this.puntero = new THREE.Vector2();
    this.pulsacion = null;
    this.pendienteMover = null;

    this.alPulsar = this.alPulsar.bind(this);
    this.alSoltar = this.alSoltar.bind(this);
    this.alMover = this.alMover.bind(this);
    this.alSalir = () => this.marcar(null);

    const escena = this.el.sceneEl;
    if (escena.canvas) this.escuchar();
    else escena.addEventListener('render-target-loaded', () => this.escuchar(), {once: true});
  },

  escuchar: function () {
    // Eventos "pointer": valen igual para ratón y para dedo
    const lienzo = this.el.sceneEl.canvas;
    lienzo.addEventListener('pointerdown', this.alPulsar);
    lienzo.addEventListener('pointerup', this.alSoltar);
    lienzo.addEventListener('pointermove', this.alMover);
    lienzo.addEventListener('pointerleave', this.alSalir);
  },

  remove: function () {
    const lienzo = this.el.sceneEl.canvas;
    if (!lienzo) return;
    lienzo.removeEventListener('pointerdown', this.alPulsar);
    lienzo.removeEventListener('pointerup', this.alSoltar);
    lienzo.removeEventListener('pointermove', this.alMover);
    lienzo.removeEventListener('pointerleave', this.alSalir);
  },

  enVR: function () {
    return this.el.sceneEl.is('vr-mode') || this.el.sceneEl.is('ar-mode');
  },

  alPulsar: function (e) {
    this.pulsacion = {x: e.clientX, y: e.clientY, t: performance.now()};
  },

  alSoltar: function (e) {
    const p = this.pulsacion;
    this.pulsacion = null;
    if (!p || this.enVR()) return;
    const arrastre = Math.hypot(e.clientX - p.x, e.clientY - p.y);
    if (arrastre > MAXIMO_ARRASTRE || performance.now() - p.t > MAXIMA_DURACION) return;

    const destino = this.buscarDestino(e.clientX, e.clientY);
    if (destino) this.el.components.teletransporte?.saltarA(destino);
  },

  // El anillo sigue al ratón (solo con ratón: en el móvil no hay "pasar por encima")
  alMover: function (e) {
    if (e.pointerType !== 'mouse' || this.enVR() || this.pulsacion) {
      if (this.pulsacion) this.marcar(null); // arrastrando para mirar
      return;
    }
    // Como mucho una búsqueda por fotograma
    this.pendienteMover = {x: e.clientX, y: e.clientY};
  },

  tick: function () {
    if (!this.pendienteMover) return;
    const {x, y} = this.pendienteMover;
    this.pendienteMover = null;
    this.marcar(this.buscarDestino(x, y));
  },

  marcar: function (punto) {
    this.el.components.teletransporte?.mostrarMarcador(punto);
  },

  // Desde la cámara, a través del punto de la pantalla: ¿qué se toca primero?
  // Devuelve {x, z} si es suelo pisable y visible; si no, null.
  buscarDestino: function (xPantalla, yPantalla) {
    const escena = this.el.sceneEl;
    const lienzo = escena.canvas;
    const caja = lienzo.getBoundingClientRect();
    // Coordenadas de la pantalla a "NDC" (−1..1), como pide THREE
    this.puntero.set(
      ((xPantalla - caja.left) / caja.width) * 2 - 1,
      -((yPantalla - caja.top) / caja.height) * 2 + 1
    );
    this.raycaster.setFromCamera(this.puntero, escena.camera);

    const impactos = this.raycaster.intersectObject(escena.object3D, true);
    const primero = impactos.find((i) => this.cuenta(i.object));
    if (!primero) return null;

    // ¿Es algo interactivo? Entonces el clic es para el cursor, no para saltar
    let o = primero.object;
    while (o) {
      if (o.el && o.el.matches?.(this.data.interactivos)) return null;
      o = o.parent;
    }

    // Tiene que ser el suelo...
    if (primero.point.y > ALTURA_SUELO) return null;
    // ...y un sitio pisable
    const mapa = this.el.components['zonas-transitables']?.mapa;
    if (mapa && !mapa.esTransitable(primero.point.x, primero.point.z)) return null;
    return {x: primero.point.x, z: primero.point.z};
  },

  // ¿Cuenta este objeto para el rayo? No: invisibles, ayudas visuales
  // (arco, anillo, rayos, mapa) ni líneas.
  cuenta: function (objeto) {
    if (objeto.isLine || objeto.isLineSegments || objeto.isPoints) return false;
    for (let o = objeto; o; o = o.parent) {
      if (!o.visible || o.userData.ayuda) return false;
    }
    return true;
  }
});
