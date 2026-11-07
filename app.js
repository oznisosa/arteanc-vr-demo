
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


// SUELO DE PIEDRA - ARTEANC VR
(() => {
  const grupo = document.querySelector('#baldosas');
  if (!grupo) return;

  const colores = [
    '#B4A594',
    '#C1B19E',
    '#AA9B89',
    '#C8B8A5'
  ];

  // Crear cuatro filas de seis baldosas
  for (let fila = 0; fila < 4; fila++) {
    for (let columna = 0; columna < 6; columna++) {

      const baldosa = document.createElement('a-plane');

      const x = -5 + columna * 2;
      const z = -5 + fila * 2;

      baldosa.setAttribute('position', `${x} 0.012 ${z}`);
      baldosa.setAttribute('rotation', '-90 0 0');
      baldosa.setAttribute('width', '1.96');
      baldosa.setAttribute('height', '1.96');

      baldosa.setAttribute(
        'material',
        `color: ${colores[(fila + columna * 2) % 4]}; roughness: 0.95`
      );

      grupo.appendChild(baldosa);
    }
  }
})();


// MOVIMIENTO CON JOYSTICK - QUEST 3

AFRAME.registerComponent('caminar-quest', {
  init: function () {
    this.eje = {x: 0, y: 0};
    this.velocidad = 1.2; // metros por segundo

    this.camara = document.querySelector('#camara').object3D;

    const mando = document.querySelector('#mando-izquierdo');

    mando.addEventListener('thumbstickmoved', (evento) => {
      this.eje.x = evento.detail.x;
      this.eje.y = evento.detail.y;
    });

    this.adelante = new THREE.Vector3();
    this.derecha = new THREE.Vector3();
  },

  tick: function (tiempo, delta) {
    if (!this.el.sceneEl.is('vr-mode')) return;
    if (!delta) return;

    const x = Math.abs(this.eje.x) > 0.2 ? this.eje.x : 0;
    const y = Math.abs(this.eje.y) > 0.2 ? this.eje.y : 0;

    if (x === 0 && y === 0) return;

    // Direccion hacia donde mira el visitante
    this.camara.getWorldDirection(this.adelante);
    this.adelante.y = 0;
    this.adelante.normalize();

    // Direccion lateral
    this.derecha.set(
      -this.adelante.z,
      0,
      this.adelante.x
    );

    const movimiento = Math.min(delta / 1000, 0.05)
      * this.velocidad;

    const posicion = this.el.object3D.position;

    // Avanzar, retroceder y moverse lateralmente
    posicion.addScaledVector(this.adelante, -y * movimiento);
    posicion.addScaledVector(this.derecha, x * movimiento);

    // Limites provisionales de nuestra sala
    posicion.x = THREE.MathUtils.clamp(posicion.x, -4.8, 4.8);
    posicion.z = THREE.MathUtils.clamp(posicion.z, -4.8, 1.6);
  }
});
