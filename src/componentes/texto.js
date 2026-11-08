// COMPONENTE `texto` - ARTEANC VR (módulo 1.5)
//
// Pone en un texto de la escena el valor de `datos/textos/es.json`.
// Uso en index.html:
//   <a-text texto="escena.bienvenidaTitulo" ...></a-text>
//   <a-text texto="clave: escena.marca; fuente: titulo" ...></a-text>
// `fuente: titulo` usa Cormorant Garamond en lugar de Inter.

import { t } from '../datos/textos.js';
import { FUENTES } from '../escena/fuentes.js';

AFRAME.registerComponent('texto', {
  schema: {
    clave: { type: 'string' },
    fuente: { default: 'texto', oneOf: ['texto', 'titulo'] }
  },

  update: function () {
    this.el.setAttribute('text', {
      value: t(this.data.clave),
      font: FUENTES[this.data.fuente]
    });
  }
});
