// FICHA DE PRODUCTO: CONEXIÓN CON LAS PIEZAS - ARTEANC VR
//
// Al hacer clic en una pieza (.producto), busca sus datos en el catálogo y
// le pide al componente `ficha-producto` (src/componentes/ficha-producto.js)
// que se muestre junto a ella. Desde el módulo 1.3 la ficha es pequeña y
// aparece al lado de la pieza; antes era un panel grande y fijo.

export function iniciarFicha(catalogo) {

  const ficha = document.querySelector('#ficha');

  document.querySelectorAll('.producto').forEach(function (pieza) {

    pieza.addEventListener('click', function () {

      const datos = catalogo[pieza.id];

      if (!datos) {
        console.warn('Producto no encontrado en el catálogo:', pieza.id);
        return;
      }

      // El componente se busca en el momento del clic: así seguro que ya existe
      ficha.components['ficha-producto'].mostrar(datos, pieza);
    });

  });
}
