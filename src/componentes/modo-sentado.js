// MODO SENTADO - QUEST 3 (módulo 2.4, DT-033)
//
// Componente A-Frame. Se usa en el #jugador así:
//   <a-entity id="jugador" modo-sentado="mando: #mando-izquierdo">
// Al importar este archivo, el componente queda registrado (no exporta nada).
//
// Para quién: la persona que usa el visor SENTADA (silla, sofá, silla de
// ruedas). Sin este modo vería la casa desde ~1,20 m: las piezas quedarían a
// la altura de la cara, como si fuera un niño.
//
// Cómo se usa: botón Y del mando izquierdo = activar / desactivar.
//   - Al ACTIVAR se calibra solo: mide a qué altura están los ojos en ese
//     momento y sube al #jugador lo justo para ver a `alturaOjos` (1,60 m,
//     la referencia del diseño final). Para recalibrar: desactivar y activar.
//   - Al DESACTIVAR se vuelve a la altura real.
//   - Un aviso breve delante de la vista confirma lo que ha pasado.
//
// De pie no hace falta nada: el Quest ya usa la altura real (conoce el suelo
// por el límite del Guardian). Solo se cambia la altura (Y) del #jugador, así
// que caminar, saltar, girar y las zonas transitables siguen igual.

import { t } from '../datos/textos.js';

const DURACION_AVISO = 2500; // ms

AFRAME.registerComponent('modo-sentado', {
  schema: {
    mando: {type: 'selector', default: '#mando-izquierdo'},
    camara: {type: 'selector', default: '#camara'},
    alturaOjos: {type: 'number', default: 1.6}  // m, ojos de pie (DISENO_FINAL §5)
  },

  init: function () {
    this.activo = false;
    this.subida = 0;

    this.alternar = this.alternar.bind(this);
    this.data.mando.addEventListener('ybuttondown', this.alternar);

    // Al salir de VR se vuelve a la altura normal: en el PC la cámara ya
    // está a 1,60 m y la subida la dejaría flotando.
    this.alSalirDeVR = () => { if (this.activo) this.desactivar(false); };
    this.el.sceneEl.addEventListener('exit-vr', this.alSalirDeVR);

    this.crearAviso();
  },

  remove: function () {
    this.data.mando.removeEventListener('ybuttondown', this.alternar);
    this.el.sceneEl.removeEventListener('exit-vr', this.alSalirDeVR);
    this.aviso.remove();
  },

  alternar: function () {
    if (this.activo) this.desactivar(true);
    else this.activar();
  },

  activar: function () {
    // Altura de los ojos SOBRE EL SUELO REAL: en VR, la posición local de la
    // cámara dentro del #jugador la pone el visor (espacio "local-floor").
    const ojos = this.data.camara.object3D.position.y;
    // Nunca bajamos a nadie: si ya está a 1,60 m o más, la subida es 0
    this.subida = Math.max(0, this.data.alturaOjos - ojos);
    this.el.object3D.position.y = this.subida;
    this.activo = true;

    this.mostrarAviso(t('movimiento.modoSentadoActivado') + '\n' + (this.subida > 0.01
      ? t('movimiento.modoSentadoElevado', {cm: Math.round(this.subida * 100)})
      : t('movimiento.modoSentadoYaDePie')));
    this.el.emit('modo-sentado', {activo: true, subida: this.subida});
  },

  desactivar: function (avisar) {
    this.el.object3D.position.y = 0;
    this.subida = 0;
    this.activo = false;
    if (avisar) {
      this.mostrarAviso(t('movimiento.modoSentadoDesactivado') + '\n' + t('movimiento.modoSentadoAlturaReal'));
    }
    this.el.emit('modo-sentado', {activo: false, subida: 0});
  },

  // ---------- Aviso delante de la vista ----------
  // Los textos están en datos/textos/es.json, sección "movimiento" (módulo 1.5).

  crearAviso: function () {
    const aviso = document.createElement('a-entity');
    aviso.setAttribute('position', '0 -0.12 -0.8');
    aviso.setAttribute('visible', false);

    const fondo = document.createElement('a-plane');
    fondo.setAttribute('width', 0.62);
    fondo.setAttribute('height', 0.16);
    fondo.setAttribute('material', 'color: #302A27; opacity: 0.85; transparent: true; shader: flat');
    aviso.appendChild(fondo);

    const texto = document.createElement('a-entity');
    texto.setAttribute('position', '0 0 0.002');
    texto.setAttribute('text', 'align: center; color: #FFF4E6; width: 0.58; wrapCount: 34; value: ');
    aviso.appendChild(texto);

    this.data.camara.appendChild(aviso);
    this.aviso = aviso;
    this.avisoTexto = texto;
  },

  mostrarAviso: function (mensaje) {
    this.avisoTexto.setAttribute('text', 'value', mensaje);
    this.aviso.setAttribute('visible', true);
    clearTimeout(this.temporizador);
    this.temporizador = setTimeout(() => this.aviso.setAttribute('visible', false), DURACION_AVISO);
  }
});
