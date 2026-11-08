// RECEPCION INTERACTIVA - ARTEANC VR
//
// Al hacer clic en el mostrador, se muestra u oculta el letrero de bienvenida.

export function iniciarRecepcion() {

  const mostradorRecepcion =
    document.querySelector('#mostradorRecepcion');

  const bienvenidaRecepcion =
    document.querySelector('#bienvenidaRecepcion');

  mostradorRecepcion.addEventListener('click', function () {

    const estaVisible =
      bienvenidaRecepcion.getAttribute('visible');

    bienvenidaRecepcion.setAttribute(
      'visible',
      !estaVisible
    );

  });
}
