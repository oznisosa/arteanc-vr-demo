// CONTROL DE PUERTAS - ARTEANC VR
//
// Los dos botones (interior y exterior) abren o cierran las dos hojas
// de la puerta corrediza y actualizan sus letreros.

import { t } from '../datos/textos.js';

export function iniciarPuertas() {

  const botonesPuerta = [
    document.querySelector('#botonPuerta'),
    document.querySelector('#botonPuertaExterior')
  ];

  const textosPuerta = [
    document.querySelector('#textoPuerta'),
    document.querySelector('#textoPuertaExterior')
  ];

  const puertaIzquierda =
    document.querySelector('#puertaIzquierda');

  const puertaDerecha =
    document.querySelector('#puertaDerecha');

  let puertasAbiertas = false;

  // Una sola funcion para ambos botones
  function alternarPuertas() {

    puertasAbiertas = !puertasAbiertas;

    const accion = puertasAbiertas ? 'abrir' : 'cerrar';

    puertaIzquierda.emit(accion);
    puertaDerecha.emit(accion);

    // Actualizar ambos letreros
    textosPuerta.forEach(function (texto) {
      texto.setAttribute(
        'value',
        puertasAbiertas ? t('escena.puertaCerrar') : t('escena.puertaAbrir')
      );
    });
  }

  // Los dos botones ejecutan la misma funcion
  botonesPuerta.forEach(function (boton) {
    boton.addEventListener('click', alternarPuertas);
  });
}
