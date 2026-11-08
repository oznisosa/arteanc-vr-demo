// PUNTO DE ENTRADA DE LA CASA (GREYBOX) - ARTEANC VR (módulo 1.7, DT-016)
//
// casa.html carga solo este archivo. La escena principal (index.html) sigue
// usando src/main.js y no cambia.

import './constructor/casa-greybox.js';
import './casa/mover-provisional.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

if (modoDepuracionActivo()) {
  activarDepuracion();
}

// Mensaje en la consola con el resumen de lo construido
document.querySelector('[casa-greybox]').addEventListener('casa-construida', (e) => {
  console.info('[ArteAnc] Casa greybox construida:', e.detail.resumen);
});
