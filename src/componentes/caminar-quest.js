// MOVIMIENTO CON JOYSTICK - QUEST 3
//
// Componente A-Frame. Se usa en index.html así: <a-entity id="jugador" caminar-quest>
// Al importar este archivo, el componente queda registrado (no exporta nada).
// Usa el joystick IZQUIERDO. El derecho es para el teletransporte
// (componentes/teletransporte.js) y el giro por pasos (DT-031).

const THREE = AFRAME.THREE;

AFRAME.registerComponent('caminar-quest', {
  init: function () {
    this.eje = {x: 0, y: 0};
    this.velocidad = 1.2; // metros por segundo

    this.camara = document.querySelector('#camara').object3D;

    const mando = document.querySelector('#mando-izquierdo');

    mando.addEventListener('thumbstickmoved', (evento) => {
      this.eje.x = evento.detail.x;
      this.eje.y = evento.detail.y;
    });

    this.adelante = new THREE.Vector3();
    this.derecha = new THREE.Vector3();
  },

  tick: function (tiempo, delta) {
    if (!this.el.sceneEl.is('vr-mode')) return;
    if (!delta) return;

    const x = Math.abs(this.eje.x) > 0.2 ? this.eje.x : 0;
    const y = Math.abs(this.eje.y) > 0.2 ? this.eje.y : 0;

    if (x === 0 && y === 0) return;

    // Direccion hacia donde mira el visitante.
    // getWorldDirection devuelve el eje +Z del objeto, que en una cámara
    // apunta hacia ATRÁS (la cámara mira hacia −Z). Por eso lo invertimos
    // con negate(). Sin esto, el joystick iba al revés (corregido el 2026-11-08).
    this.camara.getWorldDirection(this.adelante).negate();
    this.adelante.y = 0;
    this.adelante.normalize();

    // Direccion lateral
    this.derecha.set(
      -this.adelante.z,
      0,
      this.adelante.x
    );

    const movimiento = Math.min(delta / 1000, 0.05)
      * this.velocidad;

    const posicion = this.el.object3D.position;

    // Avanzar, retroceder y moverse lateralmente
    posicion.addScaledVector(this.adelante, -y * movimiento);
    posicion.addScaledVector(this.derecha, x * movimiento);

    // Limites provisionales de nuestra sala
    posicion.x = THREE.MathUtils.clamp(posicion.x, -4.8, 4.8);
    posicion.z = THREE.MathUtils.clamp(posicion.z, -4.8, 1.6);
  }
});
