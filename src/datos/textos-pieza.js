// TEXTOS DE UNA PIEZA PARA LA FICHA - ARTEANC VR (módulos 1.1 y 1.3)
//
// Convierte los datos del catálogo en los textos que muestra la ficha.
// Así la ficha no necesita saber las reglas de precios, tipos ni estados.
// Reglas: DISENO_FINAL.md §7 (tipos) y §8 (null = desconocido; precio ficticio).

// Etiqueta visible y color del chip de cada tipo de pieza (DT-014)
export const TIPOS = {
  original_documentado: { etiqueta: 'Original documentado', color: '#302A27' },          // basalto
  replica: { etiqueta: 'Réplica', color: '#795A44' },                                      // bronce
  artesania_tradicional: { etiqueta: 'Artesanía tradicional peruana', color: '#B96645' },  // terracota
  artesania_contemporanea: { etiqueta: 'Artesanía contemporánea', color: '#A88B61' }       // ocre
};
const SIN_TIPO = { etiqueta: 'Sin clasificación verificada', color: '#7A716A' };

export function tipoDePieza(pieza) {
  return TIPOS[pieza.tipoPieza] ?? SIN_TIPO;
}

function importe(pieza) {
  const simbolo = pieza.moneda === 'USD' ? 'US$' : pieza.moneda;
  return `${simbolo} ${pieza.precio.toFixed(2)}`;
}

// Texto del precio. null = desconocido, nunca "gratis".
export function textoPrecio(pieza) {
  if (pieza.precio === null) {
    return pieza.naturaleza === 'demostracion_no_vendible'
      ? 'No disponible para venta'
      : 'Precio a consultar';
  }
  if (pieza.precioEsFicticio) {
    return `Precio ficticio: ${importe(pieza)}`;
  }
  return importe(pieza);
}

// Disponibilidad. stock 0 = agotado; stock null = sin confirmar.
export function textoDisponibilidad(pieza) {
  if (pieza.naturaleza === 'demostracion_no_vendible') return 'Pieza de demostración - no está a la venta';
  if (pieza.stock === null) return 'Disponibilidad sin confirmar';
  if (pieza.stock === 0) return 'Agotado';
  return 'Disponible';
}

function textoDimensiones(d) {
  const cm = (m) => Math.round(m * 1000) / 10; // metros → cm con un decimal
  return `${cm(d.alto)} × ${cm(d.ancho)} × ${cm(d.fondo)} cm (alto × ancho × fondo)`;
}

// Todo lo que muestra la ficha, ya redactado.
// Los datos desconocidos (null) NO aparecen: no se rellenan con suposiciones.
export function contenidoFicha(pieza) {
  const tipo = tipoDePieza(pieza);

  const detalles = [];
  if (pieza.material) detalles.push(`Material: ${pieza.material}`);
  if (pieza.dimensiones_m) detalles.push(`Medidas: ${textoDimensiones(pieza.dimensiones_m)}`);
  if (pieza.cultura) detalles.push(`Cultura: ${pieza.cultura}`);
  if (pieza.epoca) detalles.push(`Época: ${pieza.epoca}`);

  // En el Santuario (y en todo original) se muestra siempre el estado de las fuentes
  if (pieza.sala === 'santuario' || pieza.tipoPieza === 'original_documentado') {
    detalles.push(pieza.fuentes.length > 0
      ? `Fuentes: ${pieza.fuentes.join('; ')}`
      : 'Historia y fuentes: Sin fuentes verificadas');
  }

  return {
    chip: tipo.etiqueta,
    colorChip: tipo.color,
    aviso: pieza.tipoPiezaEsIlustrativo ? 'Clasificación ilustrativa (demo)' : '',
    titulo: pieza.titulo,
    precio: textoPrecio(pieza),
    disponibilidad: textoDisponibilidad(pieza),
    detalles,
    descripcion: pieza.descripcion ?? ''
  };
}

// PROVISIONAL hasta el módulo 1.5: la fuente por defecto de A-Frame no tiene
// tildes ni eñes, así que se las quitamos solo al mostrar el texto.
// Los datos se guardan siempre bien escritos.
export function paraFuenteSinTildes(texto) {
  return texto
    .normalize('NFD')                 // "á" → "a" + tilde suelta; "ñ" → "n" + virgulilla
    .replace(/[̀-ͯ]/g, '')  // se borran las marcas sueltas
    .replace(/×/g, 'x');              // el signo × tampoco está en la fuente
}
