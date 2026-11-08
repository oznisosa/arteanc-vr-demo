// SUELO DE PIEDRA - ARTEANC VR
//
// Crea 4 filas × 6 columnas de baldosas dentro de #baldosas.

export function crearBaldosas() {
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
}
