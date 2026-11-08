// TEXTOS DE UNA PIEZA PARA LA FICHA - ARTEANC VR (módulos 1.1, 1.3 y 1.5)
//
// Convierte los datos del catálogo en los textos que muestra la ficha.
// Así la ficha no necesita saber las reglas de precios, tipos ni estados.
// Reglas: DISENO_FINAL.md §7 (tipos) y §8 (null = desconocido; precio ficticio).
// Las frases están en datos/textos/es.json (módulo 1.5).

import { t } from './textos.js';

// Color del chip de cada tipo de pieza (paleta del diseño final, DT-014)
const COLORES_TIPO = {
  original_documentado: '#302A27',     // basalto
  replica: '#795A44',                  // bronce
  artesania_tradicional: '#B96645',    // terracota
  artesania_contemporanea: '#A88B61'   // ocre
};

export function tipoDePieza(pieza) {
  const conocido = pieza.tipoPieza in COLORES_TIPO;
  return {
    etiqueta: t(`tipos.${conocido ? pieza.tipoPieza : 'sinClasificar'}`),
    color: conocido ? COLORES_TIPO[pieza.tipoPieza] : '#7A716A'
  };
}

function importe(pieza) {
  const simbolo = pieza.moneda === 'USD' ? 'US$' : pieza.moneda;
  return `${simbolo} ${pieza.precio.toFixed(2)}`;
}

// Texto del precio. null = desconocido, nunca "gratis".
export function textoPrecio(pieza) {
  if (pieza.precio === null) {
    return pieza.naturaleza === 'demostracion_no_vendible' ? t('ficha.noDisponible') : t('ficha.precioConsultar');
  }
  if (pieza.precioEsFicticio) {
    return t('ficha.precioFicticio', { importe: importe(pieza) });
  }
  return importe(pieza);
}

// Disponibilidad. stock 0 = agotado; stock null = sin confirmar.
export function textoDisponibilidad(pieza) {
  if (pieza.naturaleza === 'demostracion_no_vendible') return t('ficha.demostracion');
  if (pieza.stock === null) return t('ficha.disponibilidadSinConfirmar');
  if (pieza.stock === 0) return t('ficha.agotado');
  return t('ficha.disponible');
}

const cm = (m) => Math.round(m * 1000) / 10; // metros → cm con un decimal

// Todo lo que muestra la ficha, ya redactado.
// Los datos desconocidos (null) NO aparecen: no se rellenan con suposiciones.
export function contenidoFicha(pieza) {
  const tipo = tipoDePieza(pieza);

  const detalles = [];
  if (pieza.material) detalles.push(t('ficha.material', { valor: pieza.material }));
  if (pieza.dimensiones_m) {
    const d = pieza.dimensiones_m;
    detalles.push(t('ficha.medidas', { alto: cm(d.alto), ancho: cm(d.ancho), fondo: cm(d.fondo) }));
  }
  if (pieza.cultura) detalles.push(t('ficha.cultura', { valor: pieza.cultura }));
  if (pieza.epoca) detalles.push(t('ficha.epoca', { valor: pieza.epoca }));

  // En el Santuario (y en todo original) se muestra siempre el estado de las fuentes
  if (pieza.sala === 'santuario' || pieza.tipoPieza === 'original_documentado') {
    detalles.push(pieza.fuentes.length > 0
      ? t('ficha.fuentes', { valor: pieza.fuentes.join('; ') })
      : t('ficha.sinFuentes'));
  }

  return {
    chip: tipo.etiqueta,
    colorChip: tipo.color,
    aviso: pieza.tipoPiezaEsIlustrativo ? t('ficha.avisoIlustrativo') : '',
    titulo: pieza.titulo,
    precio: textoPrecio(pieza),
    disponibilidad: textoDisponibilidad(pieza),
    detalles,
    descripcion: pieza.descripcion ?? ''
  };
}
