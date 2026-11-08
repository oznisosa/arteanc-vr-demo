// FICHA DE PRODUCTO - ARTEANC VR
//
// Al hacer clic en una pieza (.producto), rellena la ficha con sus datos
// del catálogo y la muestra. El botón #cerrarFicha la oculta.

export function iniciarFicha(catalogo) {

  // Buscamos los elementos de la escena
  const ficha = document.querySelector('#ficha');
  const nombre = document.querySelector('#nombre');
  const precio = document.querySelector('#precio');
  const descripcion = document.querySelector('#descripcion');

  // Seleccionamos todos los productos
  const piezas = document.querySelectorAll('.producto');

  // Configuramos cada producto
  piezas.forEach(function (pieza) {

    pieza.addEventListener('click', function () {

      // Buscamos sus datos
      const datos = catalogo[pieza.id];

      if (!datos) {
        console.warn('Producto no encontrado:', pieza.id);
        return;
      }

      // Actualizamos el panel
      nombre.setAttribute('value', datos.nombre);
      precio.setAttribute('value', datos.precio);
      descripcion.setAttribute('value', datos.descripcion);

      // Mostramos la ficha
      ficha.setAttribute('visible', true);

    });

  });

  // Botón para cerrar el panel
  document.querySelector('#cerrarFicha')
    .addEventListener('click', function () {
      ficha.setAttribute('visible', false);
    });
}
