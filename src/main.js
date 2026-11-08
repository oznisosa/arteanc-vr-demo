// PUNTO DE ENTRADA - ARTEANC VR
//
// index.html carga solo este archivo (<script type="module">).
// Desde aquí se importa cada parte del proyecto, un archivo por responsabilidad:
//
//   datos/catalogo.js           → datos de las piezas
//   componentes/caminar-quest.js → componente A-Frame de movimiento (se registra al importarlo)
//   escena/suelo.js             → baldosas del suelo
//   escena/ajustar-modelo.js    → escala y apoya el modelo 3D en su pedestal
//   interaccion/ficha.js        → ficha de producto
//   interaccion/puertas.js      → puertas corredizas
//   interaccion/recepcion.js    → letrero de bienvenida
//   depuracion.js               → medidor de rendimiento, solo con ?debug
//
// Este archivo solo usa rutas relativas ("./…"), así que funciona igual con
// Vite y servido tal cual por GitHub Pages.

import { catalogo } from './datos/catalogo.js';
import './componentes/caminar-quest.js';
import { crearBaldosas } from './escena/suelo.js';
import { ajustarModeloAPedestal } from './escena/ajustar-modelo.js';
import { iniciarFicha } from './interaccion/ficha.js';
import { iniciarPuertas } from './interaccion/puertas.js';
import { iniciarRecepcion } from './interaccion/recepcion.js';
import { modoDepuracionActivo, activarDepuracion } from './depuracion.js';

iniciarFicha(catalogo);

// El modelo 3D (#pieza02): dimensión mayor 0.65 m, apoyado a 1.02 m de altura
ajustarModeloAPedestal('#pieza02', 0.65, 1.02);

crearBaldosas();
iniciarPuertas();
iniciarRecepcion();

if (modoDepuracionActivo()) {
  activarDepuracion();
}
