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
//   componentes/ficha-producto.js → ficha pequeña junto a la pieza (1.3)
//   escena/suelo.js             → baldosas del suelo
//   interaccion/ficha.js        → conecta el clic en cada pieza con la ficha
//   interaccion/puertas.js      → puertas corredizas
//   interaccion/recepcion.js    → letrero de bienvenida
//   depuracion.js               → medidor de rendimiento, solo con ?debug
//
// Vite empaqueta estos módulos en `npm run build`, y GitHub Actions publica
// el resultado (DT-013).

import { catalogoListo } from './datos/catalogo-servicio.js';
import './componentes/caminar-quest.js';
import './componentes/pieza-exhibida.js';
import './componentes/ficha-producto.js';
import { crearBaldosas } from './escena/suelo.js';
import { iniciarFicha } from './interaccion/ficha.js';
import { iniciarPuertas } from './interaccion/puertas.js';
import { iniciarRecepcion } from './interaccion/recepcion.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

// FASE 2 - movimiento
// componentes/zonas-transitables.js → mapa de dónde se puede pisar (módulo 2.3)
import './componentes/zonas-transitables.js';
// componentes/teletransporte.js → joystick derecho adelante: arco y salto (módulo 2.1)
import './componentes/teletransporte.js';
// componentes/giro-por-pasos.js → joystick derecho a los lados: girar 30° (módulo 2.2)
import './componentes/giro-por-pasos.js';

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
