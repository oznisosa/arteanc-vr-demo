// GIRO POR PASOS - QUEST 3 (módulo 2.2, DT-031)
//
// Componente A-Frame. Se usa en index.html así:
//   <a-entity id="jugador" giro-por-pasos="mando: #mando-derecho">
// Al importar este archivo, el componente queda registrado (no exporta nada).
//
// Joystick DERECHO a un lado → giro de 30° de golpe hacia ese lado.
// Para volver a girar hay que soltar el joystick (que vuelva al centro).
//
// Por qué de golpe y no suave: un giro suave hace que la vista se mueva
// sin que el cuerpo lo sienta (vección), y eso marea. Un salto instantáneo
// no da tiempo a esa sensación.
//
// El giro se hace alrededor de la CABEZA, no del centro del #jugador.
// Si la persona dio pasos reales por su habitación, su cabeza no está en el
// centro del rig; si girásemos el rig sobre su centro, la cabeza "volaría"
// en círculo alrededor de ese punto.

const THREE = AFRAME.THREE;

AFRAME.registerComponent('giro-por-pasos', {
  schema: {
    mando: {type: 'selector', default: '#mando-derecho'},
    camara: {type: 'selector', default: '#camara'},
    angulo: {type: 'number', default: 30}   // grados por cada paso
  },

  init: function () {
    this.preparado = true;   // false mientras el joystick siga a un lado
    this.cabeza = new THREE.Vector3();
    this.desdeCabeza = new THREE.Vector3();
    this.ejeY = new THREE.Vector3(0, 1, 0);

    this.alMoverJoystick = this.alMoverJoystick.bind(this);
    this.data.mando.addEventListener('thumbstickmoved', this.alMoverJoystick);
  },

  remove: function () {
    this.data.mando.removeEventListener('thumbstickmoved', this.alMoverJoystick);
  },

  alMoverJoystick: function (evento) {
    const {x, y} = evento.detail;

    // Joystick de vuelta al centro: se puede girar otra vez
    if (Math.hypot(x, y) < 0.3) {
      this.preparado = true;
      return;
    }

    // Si se está apuntando un salto, el joystick es del teletransporte
    const teletransporte = this.el.components.teletransporte;
    if (teletransporte && teletransporte.apuntando) return;

    // Empuje claramente lateral: más horizontal que vertical
    if (this.preparado && Math.abs(x) > 0.7 && Math.abs(x) > Math.abs(y)) {
      this.preparado = false;
      // Derecha (x > 0) = giro horario visto desde arriba = ángulo negativo en Y
      const signo = x > 0 ? -1 : 1;
      this.girar(signo * THREE.MathUtils.degToRad(this.data.angulo));
    }
  },

  // Gira el #jugador un ángulo (radianes) alrededor del eje vertical que
  // pasa por la cabeza:
  //   nuevaPosición = cabeza + rotar(posición − cabeza)
  girar: function (angulo) {
    const jugador = this.el.object3D;
    this.data.camara.object3D.getWorldPosition(this.cabeza);

    this.desdeCabeza.copy(jugador.position).sub(this.cabeza);
    this.desdeCabeza.applyAxisAngle(this.ejeY, angulo);

    jugador.position.x = this.cabeza.x + this.desdeCabeza.x;
    jugador.position.z = this.cabeza.z + this.desdeCabeza.z;
    jugador.rotation.y += angulo;

    this.el.emit('girado', {grados: THREE.MathUtils.radToDeg(angulo)});
  }
});
