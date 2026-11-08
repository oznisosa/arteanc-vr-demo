// PUNTO DE ENTRADA DE LA CASA (GREYBOX) - ARTEANC VR (módulo 1.7, DT-016)
//
// casa.html carga solo este archivo. La escena principal (index.html) sigue
// usando src/main.js y no cambia.

import './escena/fuentes.js'; // primero: fuente con tildes (1.5)
import './constructor/casa-greybox.js';
// Piezas del catálogo y su ficha dentro de la casa (módulo 1.8)
import './componentes/pieza-exhibida.js';
import './componentes/ficha-producto.js';
import { catalogoListo } from './datos/catalogo-servicio.js';
import { iniciarFicha } from './interaccion/ficha.js';
import './casa/mover-provisional.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

if (modoDepuracionActivo()) {
  activarDepuracion();
}

// Cuando la casa está construida (con sus piezas), se conecta la ficha
document.querySelector('[casa-greybox]').addEventListener('casa-construida', async (e) => {
  console.info('[ArteAnc] Casa greybox construida:', e.detail.resumen);
  iniciarFicha(await catalogoListo);
});
