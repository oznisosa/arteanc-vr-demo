// PUNTO DE ENTRADA DE LA CASA (GREYBOX) - ARTEANC VR (módulo 1.7, DT-016)
//
// casa.html carga solo este archivo. La escena principal (index.html) sigue
// usando src/main.js y no cambia.

import './escena/fuentes.js'; // primero: fuente con tildes (1.5)
import './constructor/casa-greybox.js';
// FASE 2 - movimiento (módulo 2.3): los mismos componentes que index.html
import './componentes/zonas-transitables.js';
import './componentes/caminar-quest.js';
import './componentes/teletransporte.js';
import './componentes/giro-por-pasos.js';
import './componentes/modo-sentado.js';
import './componentes/mano-puntero.js';
import './componentes/clic-en-suelo.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

if (modoDepuracionActivo()) {
  activarDepuracion();
}

// Mensaje en la consola con el resumen de lo construido
document.querySelector('[casa-greybox]').addEventListener('casa-construida', (e) => {
  console.info('[ArteAnc] Casa greybox construida:', e.detail.resumen);
});
