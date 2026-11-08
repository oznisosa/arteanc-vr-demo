// PUNTO DE ENTRADA - ARTEANC VR
//
// index.html carga solo este archivo (<script type="module">).
// Desde aquí se importa cada parte del proyecto, un archivo por responsabilidad:
//
//   datos/cargar-catalogo.js    → descarga datos/catalogo.json (módulo 1.1)
//   datos/catalogo-servicio.js  → comparte esa descarga (una sola vez) con todos
//   datos/textos-pieza.js       → convierte los datos de una pieza en textos
//   componentes/caminar-quest.js → componente A-Frame de movimiento (se registra al importarlo)
//   componentes/pieza-exhibida.js → peana + modelo de cada pieza, desde el catálogo (1.2)
//   escena/suelo.js             → baldosas del suelo
//   interaccion/ficha.js        → ficha de producto
//   interaccion/puertas.js      → puertas corredizas
//   interaccion/recepcion.js    → letrero de bienvenida
//   depuracion.js               → medidor de rendimiento, solo con ?debug
//
// Vite empaqueta estos módulos en `npm run build`, y GitHub Actions publica
// el resultado (DT-013).

import { catalogoListo } from './datos/catalogo-servicio.js';
import './componentes/caminar-quest.js';
import './componentes/pieza-exhibida.js';
import { crearBaldosas } from './escena/suelo.js';
import { iniciarFicha } from './interaccion/ficha.js';
import { iniciarPuertas } from './interaccion/puertas.js';
import { iniciarRecepcion } from './interaccion/recepcion.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

// 1. Lo que no depende de datos externos se prepara enseguida
// (las piezas se montan solas: ver pieza-exhibida en index.html)
crearBaldosas();
iniciarPuertas();
iniciarRecepcion();

if (modoDepuracionActivo()) {
  activarDepuracion();
}

// 2. El catálogo llega por la red: lo esperamos y después activamos la ficha
try {
  const catalogo = await catalogoListo;
  iniciarFicha(catalogo);
} catch (error) {
  console.error('[ArteAnc] No se pudo cargar el catálogo:', error);
}
