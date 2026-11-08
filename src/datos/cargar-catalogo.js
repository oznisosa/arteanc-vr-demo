// CARGAR EL CATÁLOGO - ARTEANC VR (módulo 1.1)
//
// Descarga `datos/catalogo.json` y lo devuelve como un objeto indexado por el
// `id` de cada pieza en la escena: { pieza01: {...}, pieza02: {...} }.
//
// Es asíncrono (`async`/`await`): el archivo llega por la red y hay que
// esperarlo. Mientras tanto, la escena ya se está dibujando.

export async function cargarCatalogo(ruta = './datos/catalogo.json') {
  const respuesta = await fetch(ruta);

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar ${ruta} (HTTP ${respuesta.status})`);
  }

  const datos = await respuesta.json();

  const porId = {};
  for (const pieza of datos.piezas) {
    porId[pieza.id] = pieza;
  }
  return porId;
}
