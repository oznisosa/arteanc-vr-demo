// AJUSTAR UN MODELO 3D A SU PEDESTAL - ARTEANC VR
//
// Escala el modelo para que su dimensión mayor mida `tamanoMaximo` metros
// y apoya su parte inferior a la altura `alturaApoyo`.
// En la Fase 3 los modelos llegarán ya a escala real y esto no hará falta.

export function ajustarModeloAPedestal(selector, tamanoMaximo, alturaApoyo) {

  const pieza3D = document.querySelector(selector);

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

    // Ajustamos su dimensión mayor al tamaño indicado
    const factor = tamanoMaximo / dimensionMayor;
    modelo.scale.multiplyScalar(factor);

    // Colocamos su parte inferior sobre el pedestal
    const cajaFinal = new THREE.Box3().setFromObject(modelo);

    modelo.position.y += alturaApoyo - cajaFinal.min.y;
  }

  // Cuando el archivo termina de cargarse
  pieza3D.addEventListener('model-loaded', ajustarModelo);

  // Por si el archivo ya estaba cargado
  if (pieza3D.getObject3D('mesh')) {
    ajustarModelo();
  }
}
