// MODO DEPURACIÓN - ARTEANC VR (módulo 0.5)
//
// Si la dirección termina en `?debug` (por ejemplo
// https://192.168.200.6:5173/?debug), se activan las herramientas de medición:
//   - el panel `stats` de A-Frame (esquina superior izquierda, solo en el PC);
//   - el panel `medidor-rendimiento`, pegado a la cámara (se ve también en VR).
// Sin `?debug`, el visitante no ve nada de esto.

import './componentes/medidor-rendimiento.js';
import { estado } from './servicios/estado.js';

export function modoDepuracionActivo() {
  return new URLSearchParams(window.location.search).has('debug');
}

export function activarDepuracion() {
  const escena = document.querySelector('a-scene');
  const camara = document.querySelector('#camara');

  // Panel estándar de A-Frame: fps, llamadas (Calls), triángulos (Faces)...
  escena.setAttribute('stats', '');

  // Panel propio, abajo a la izquierda de la vista, a 80 cm
  const medidor = document.createElement('a-entity');
  medidor.setAttribute('medidor-rendimiento', '');
  medidor.setAttribute('position', '-0.22 -0.2 -0.8');
  camara.appendChild(medidor);

  // Acceso al estado desde la consola del navegador (F12):
  //   arteanc.estado.instantanea()   arteanc.estado.alternarFavorito('pieza01')
  window.arteanc = { estado };
  estado.alCambiar('piezaSeleccionada', (id) => console.info('[estado] pieza seleccionada:', id));
  estado.alCambiar('favoritos', (lista) => console.info('[estado] favoritos:', lista));

  console.info('[ArteAnc] Modo depuración activo (?debug). Estado:', estado.instantanea());
}
