// TELETRANSPORTE - QUEST 3 (módulo 2.1, DT-031)
//
// Componente A-Frame. Se usa en index.html así:
//   <a-entity id="jugador" teletransporte="mando: #mando-derecho">
// Al importar este archivo, el componente queda registrado (no exporta nada).
//
// Cómo se usa en el visor:
//   1. Empujar el joystick DERECHO hacia delante → aparece un arco y un
//      anillo en el suelo donde vas a caer.
//   2. Soltar el joystick → fundido a negro muy breve y apareces en el anillo.
//   Si el arco sale rojo y sin anillo, el destino no vale y no se salta.
//
// El arco es una parábola, como la trayectoria de una piedra lanzada:
//   posición(t) = origen + velocidad · t + ½ · gravedad · t²
// Se calcula por tramos cortos y se comprueba dónde toca el suelo (y = 0).
//
// Dónde se puede caer: lo decide el mapa de zonas-transitables (módulo 2.3,
// DT-032), si el #jugador lo tiene. El arco se corta al tocar un muro, el
// techo o un mueble, y solo vale caer en suelo pisable.

const THREE = AFRAME.THREE;

const GRAVEDAD = -9.8;      // m/s², hacia abajo
const TRAMOS = 40;          // puntos del arco (más = más suave)
const PASO_TIEMPO = 0.04;   // segundos entre puntos → arco de 1,6 s como máximo
const ANCHO_ARCO = 0.025;   // metros
const DURACION_FUNDIDO = 90; // ms para oscurecer (y otros tantos para aclarar)

AFRAME.registerComponent('teletransporte', {
  schema: {
    mando: {type: 'selector', default: '#mando-derecho'},
    camara: {type: 'selector', default: '#camara'},
    velocidad: {type: 'number', default: 7}    // m/s con que "sale" el arco
  },

  init: function () {
    this.apuntando = false;
    this.destinoValido = false;
    this.destino = new THREE.Vector3();

    // Vectores reutilizables (crear objetos en cada fotograma gasta memoria)
    this.origen = new THREE.Vector3();
    this.direccion = new THREE.Vector3();
    this.puntoAnterior = new THREE.Vector3();
    this.punto = new THREE.Vector3();
    this.lateral = new THREE.Vector3();
    this.posCamara = new THREE.Vector3();
    this.arriba = new THREE.Vector3(0, 1, 0);

    this.crearArco();
    this.crearMarcador();
    this.crearFundido();

    this.alMoverJoystick = this.alMoverJoystick.bind(this);
    this.data.mando.addEventListener('thumbstickmoved', this.alMoverJoystick);

    // Si se sale de VR a mitad de apuntar, se cancela
    this.el.sceneEl.addEventListener('exit-vr', () => this.dejarDeApuntar());
  },

  remove: function () {
    this.data.mando.removeEventListener('thumbstickmoved', this.alMoverJoystick);
    this.el.sceneEl.object3D.remove(this.arco, this.marcador);
    this.data.camara.object3D.remove(this.fundido);
  },

  // ---------- Joystick ----------

  alMoverJoystick: function (evento) {
    const {x, y} = evento.detail;

    // En el joystick, "hacia delante" es y negativo.
    // Solo empieza si el empuje es claramente hacia delante: los lados
    // quedan libres para el giro por pasos (módulo 2.2).
    if (!this.apuntando && y < -0.6 && Math.abs(y) > Math.abs(x)) {
      this.empezarAApuntar();
    } else if (this.apuntando && Math.hypot(x, y) < 0.25) {
      // Joystick suelto (vuelve al centro): saltar si el destino vale
      const saltar = this.destinoValido;
      this.dejarDeApuntar();
      if (saltar) this.saltar();
    }
  },

  empezarAApuntar: function () {
    this.apuntando = true;
    this.arco.visible = true;
    // Mientras se apunta, se oculta el láser recto del mismo mando
    this.data.mando.setAttribute('raycaster', 'showLine', false);
  },

  dejarDeApuntar: function () {
    this.apuntando = false;
    this.destinoValido = false;
    this.arco.visible = false;
    this.marcador.visible = false;
    this.data.mando.setAttribute('raycaster', 'showLine', true);
  },

  // ---------- Cada fotograma ----------

  tick: function (tiempo, delta) {
    if (this.fundidoActivo) this.animarFundido(delta);
    if (this.apuntando) this.calcularArco();
  },

  calcularArco: function () {
    const d = this.data;
    const mando = d.mando.object3D;
    mando.updateMatrixWorld();

    // El arco sale de donde sale el láser. laser-controls ajusta el origen
    // y la dirección del raycaster a cada modelo de mando.
    const rayo = d.mando.getAttribute('raycaster');
    this.origen.copy(rayo.origin);
    mando.localToWorld(this.origen);
    this.direccion.copy(rayo.direction).transformDirection(mando.matrixWorld);

    // Velocidad inicial del arco
    const vx = this.direccion.x * d.velocidad;
    const vy = this.direccion.y * d.velocidad;
    const vz = this.direccion.z * d.velocidad;

    // Dirección lateral, para dar ancho a la cinta del arco
    this.lateral.set(-this.direccion.z, 0, this.direccion.x).normalize()
      .multiplyScalar(ANCHO_ARCO / 2);

    // El mapa de zonas-transitables (null si aún no está listo o no hay)
    const mapa = this.el.components['zonas-transitables']?.mapa ?? null;

    const vertices = this.arcoGeometria.attributes.position;
    this.puntoAnterior.copy(this.origen);
    let ultimo = TRAMOS;     // índice del último punto dibujado
    let valido = false;

    for (let i = 0; i <= TRAMOS; i++) {
      const t = i * PASO_TIEMPO;
      this.punto.set(
        this.origen.x + vx * t,
        this.origen.y + vy * t + 0.5 * GRAVEDAD * t * t,
        this.origen.z + vz * t
      );

      // ¿Toca el suelo en este tramo? Interpolamos el punto exacto en y = 0
      if (this.punto.y <= 0 && i > 0) {
        const f = this.puntoAnterior.y / (this.puntoAnterior.y - this.punto.y);
        this.punto.lerpVectors(this.puntoAnterior, this.punto, f);
        this.punto.y = 0;
        valido = mapa ? mapa.esTransitable(this.punto.x, this.punto.z) : true;
        this.ponerVertice(vertices, i, this.punto);
        ultimo = i;
        break;
      }

      // ¿Choca con un muro, el techo o un mueble? Entonces el arco termina aquí
      if (i > 0 && mapa && !mapa.aireLibre(this.punto.x, this.punto.y, this.punto.z)) {
        this.ponerVertice(vertices, i, this.punto);
        ultimo = i;
        break;
      }

      this.ponerVertice(vertices, i, this.punto);
      this.puntoAnterior.copy(this.punto);
    }

    // Los puntos que sobran se colapsan sobre el último (no se ven)
    for (let i = ultimo + 1; i <= TRAMOS; i++) {
      this.ponerVertice(vertices, i, this.punto);
    }
    vertices.needsUpdate = true;
    this.arcoGeometria.computeBoundingSphere();

    this.destinoValido = valido;
    this.arcoMaterial.color.set(valido ? '#F4E9D8' : '#D9534F');
    this.marcador.visible = valido;
    if (valido) {
      this.destino.copy(this.punto);
      this.marcador.position.set(this.punto.x, 0.02, this.punto.z);
    }
  },

  // Cada punto del arco son dos vértices (izquierda y derecha de la cinta)
  ponerVertice: function (vertices, i, p) {
    vertices.setXYZ(i * 2, p.x - this.lateral.x, p.y, p.z - this.lateral.z);
    vertices.setXYZ(i * 2 + 1, p.x + this.lateral.x, p.y, p.z + this.lateral.z);
  },

  // ---------- Salto ----------

  saltar: function () {
    this.fundidoActivo = true;
    this.fundidoTiempo = 0;
    this.yaMovido = false;
  },

  // Mueve el #jugador para que los PIES (bajo la cámara) queden en el destino.
  // En el Quest la cabeza puede estar lejos del centro del #jugador, porque
  // la persona camina físicamente por su habitación. Por eso se mueve el
  // jugador lo que separa la cámara del destino, y no al destino directamente.
  moverJugador: function () {
    this.data.camara.object3D.getWorldPosition(this.posCamara);
    const posicion = this.el.object3D.position;
    posicion.x += this.destino.x - this.posCamara.x;
    posicion.z += this.destino.z - this.posCamara.z;
    this.el.emit('teletransportado', {destino: this.destino.clone()});
  },

  // Oscurece, mueve al jugador cuando todo está negro, y vuelve a aclarar
  animarFundido: function (delta) {
    this.fundidoTiempo += delta || 16;
    const t = this.fundidoTiempo;

    if (t < DURACION_FUNDIDO) {
      this.fundidoMaterial.opacity = t / DURACION_FUNDIDO;
    } else if (t < DURACION_FUNDIDO * 2) {
      if (!this.yaMovido) {
        this.moverJugador();
        this.yaMovido = true;
      }
      this.fundidoMaterial.opacity = 1 - (t - DURACION_FUNDIDO) / DURACION_FUNDIDO;
    } else {
      this.fundidoMaterial.opacity = 0;
      this.fundidoActivo = false;
    }
    this.fundido.visible = this.fundidoActivo;
  },

  // ---------- Piezas visuales (THREE.js directo) ----------

  crearArco: function () {
    // Una "cinta": dos vértices por punto y dos triángulos por tramo
    const posiciones = new Float32Array((TRAMOS + 1) * 2 * 3);
    const indices = [];
    for (let i = 0; i < TRAMOS; i++) {
      const a = i * 2, b = a + 1, c = a + 2, e = a + 3;
      indices.push(a, b, c, b, e, c);
    }
    this.arcoGeometria = new THREE.BufferGeometry();
    this.arcoGeometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
    this.arcoGeometria.setIndex(indices);

    this.arcoMaterial = new THREE.MeshBasicMaterial({
      color: '#F4E9D8', side: THREE.DoubleSide, transparent: true, opacity: 0.85
    });
    this.arco = new THREE.Mesh(this.arcoGeometria, this.arcoMaterial);
    this.arco.frustumCulled = false; // la geometría cambia cada fotograma
    this.arco.visible = false;
    this.el.sceneEl.object3D.add(this.arco);
  },

  crearMarcador: function () {
    // Anillo plano sobre el suelo
    const geometria = new THREE.RingGeometry(0.22, 0.3, 32);
    geometria.rotateX(-Math.PI / 2);
    const material = new THREE.MeshBasicMaterial({
      color: '#F4E9D8', transparent: true, opacity: 0.9
    });
    this.marcador = new THREE.Mesh(geometria, material);
    this.marcador.visible = false;
    this.el.sceneEl.object3D.add(this.marcador);
  },

  crearFundido: function () {
    // Una esfera negra pequeña alrededor de la cabeza, vista por dentro.
    // depthTest: false → se dibuja encima de todo.
    const geometria = new THREE.SphereGeometry(0.3, 16, 8);
    this.fundidoMaterial = new THREE.MeshBasicMaterial({
      color: '#000000', side: THREE.BackSide, transparent: true,
      opacity: 0, depthTest: false
    });
    this.fundido = new THREE.Mesh(geometria, this.fundidoMaterial);
    this.fundido.renderOrder = 999;
    this.fundido.visible = false;
    this.data.camara.object3D.add(this.fundido);
  }
});
