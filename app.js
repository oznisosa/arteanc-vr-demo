
// Obtenemos los datos de nuestros productos
const catalogo = window.catalogoArteAnc;

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



// AJUSTAR EL MODELO 3D A SU PEDESTAL

const pieza3D = document.querySelector('#pieza02');

function ajustarModelo() {
  const modelo = pieza3D.getObject3D('mesh');

  if (!modelo) return;

  const THREE = AFRAME.THREE;

  // Medimos el modelo original
  const caja = new THREE.Box3().setFromObject(modelo);
  const tamano = caja.getSize(new THREE.Vector3());

  const dimensionMayor = Math.max(
    tamano.x, tamano.y, tamano.z
  );

  if (dimensionMayor <= 0) return;

  // Ajustamos su dimensión mayor a 65 cm
  const factor = 0.65 / dimensionMayor;
  modelo.scale.multiplyScalar(factor);

  // Colocamos su parte inferior sobre el pedestal
  const cajaFinal = new THREE.Box3().setFromObject(modelo);

  modelo.position.y += 1.02 - cajaFinal.min.y;
}

// Cuando el archivo termina de cargarse
pieza3D.addEventListener('model-loaded', ajustarModelo);

// Por si el archivo ya estaba cargado
if (pieza3D.getObject3D('mesh')) {
  ajustarModelo();
}
