// TEXTOS DE UNA PIEZA PARA LA FICHA - ARTEANC VR (módulo 1.1)
//
// Convierte los datos del catálogo en los textos que muestra la ficha.
// Así la ficha no necesita saber las reglas de precios ni de tipos.

// Etiqueta visible de cada tipo de pieza (DISENO_FINAL.md §7 y DT-014)
export const ETIQUETAS_TIPO = {
  original_documentado: 'Original documentado',
  replica: 'Réplica',
  artesania_tradicional: 'Artesanía tradicional peruana',
  artesania_contemporanea: 'Artesanía contemporánea'
};

export function etiquetaTipo(pieza) {
  return ETIQUETAS_TIPO[pieza.tipoPieza] ?? 'Sin clasificación verificada';
}

// Texto del precio según las reglas del contrato de datos (DISENO_FINAL.md §8):
// null = desconocido, nunca "gratis".
export function textoPrecio(pieza) {
  if (pieza.naturaleza === 'demostracion_no_vendible' && pieza.precio === null) {
    return 'No disponible para venta';
  }
  if (pieza.precio === null) {
    return 'Precio a consultar';
  }
  const simbolo = pieza.moneda === 'USD' ? 'US$' : pieza.moneda;
  return `${simbolo} ${pieza.precio.toFixed(2)}`;
}

// PROVISIONAL hasta el módulo 1.5: la fuente por defecto de A-Frame no tiene
// tildes ni eñes, así que se las quitamos solo al mostrar el texto.
// Los datos se guardan siempre bien escritos.
export function paraFuenteSinTildes(texto) {
  return texto
    .normalize('NFD')                 // "á" → "a" + tilde suelta; "ñ" → "n" + virgulilla
    .replace(/[̀-ͯ]/g, ''); // se borran las marcas sueltas
}
