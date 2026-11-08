// MOVIMIENTO PROVISIONAL PARA LA CASA - ARTEANC VR (módulo 1.7, DT-016)
//
// ⚠️ TEMPORAL. Solo para recorrer el greybox en casa.html mientras la Fase 2
// (teletransporte, giro por pasos, zonas transitables) se trabaja en la rama
// `fase-2`. Al fusionar la Fase 2, este archivo se BORRA y casa.html usará
// sus componentes. Es una copia simplificada de caminar-quest SIN los límites
// de la sala vieja (en la casa todavía se pueden atravesar muros).
//
// Joystick izquierdo: caminar hacia donde se mira. Joystick derecho: girar 30°.

const THREE = AFRAME.THREE;

AFRAME.registerComponent('mover-provisional', {
  schema: {
    velocidad: { type: 'number', default: 1.5 }, // m/s
    giro: { type: 'number', default: 30 }        // grados por pulsación
  },

  init: function () {
    this.eje = { x: 0, y: 0 };
    this.girado = false;
    this.adelante = new THREE.Vector3();
    this.derecha = new THREE.Vector3();
    this.camara = document.querySelector('#camara').object3D;

    document.querySelector('#mando-izquierdo').addEventListener('thumbstickmoved', (e) => {
      this.eje.x = e.detail.x;
      this.eje.y = e.detail.y;
    });

    // Giro por pasos: un golpe de joystick = 30°, hay que soltarlo para repetir
    document.querySelector('#mando-derecho').addEventListener('thumbstickmoved', (e) => {
      if (Math.abs(e.detail.x) > 0.7 && !this.girado) {
        this.el.object3D.rotation.y -= Math.sign(e.detail.x) * THREE.MathUtils.degToRad(this.data.giro);
        this.girado = true;
      } else if (Math.abs(e.detail.x) < 0.3) {
        this.girado = false;
      }
    });
  },

  tick: function (tiempo, delta) {
    if (!this.el.sceneEl.is('vr-mode') || !delta) return;
    const x = Math.abs(this.eje.x) > 0.2 ? this.eje.x : 0;
    const y = Math.abs(this.eje.y) > 0.2 ? this.eje.y : 0;
    if (x === 0 && y === 0) return;

    // Hacia donde mira la cámara (su eje −Z), en horizontal
    this.camara.getWorldDirection(this.adelante).negate();
    this.adelante.y = 0;
    this.adelante.normalize();
    this.derecha.set(-this.adelante.z, 0, this.adelante.x);

    const paso = Math.min(delta / 1000, 0.05) * this.data.velocidad;
    const pos = this.el.object3D.position;
    pos.addScaledVector(this.adelante, -y * paso);
    pos.addScaledVector(this.derecha, x * paso);
  }
});
