// VALIDAR EL CATÁLOGO - ARTEANC VR (módulo 1.1)
//
// Uso: `npm run validar`. También se ejecuta solo antes de `npm run build`,
// así que GitHub no publica la web si el catálogo tiene errores.
//
// Comprueba que `datos/catalogo.json`:
//   - es JSON válido (sin comas de más, comillas bien cerradas…);
//   - cada pieza tiene todos los campos (con valor o con null);
//   - los valores de tipoPieza, naturaleza, sala, moneda… son de las listas permitidas;
//   - no hay `id` ni `sku` repetidos;
//   - cada `posicion` existe en datos/salas.json, es de la misma sala que la
//     pieza y no la ocupa otra pieza (módulo 1.8).
// Guía de campos: docs/CATALOGO.md

import { readFileSync } from 'node:fs';

const RUTA = 'datos/catalogo.json';

const CAMPOS = [
  'id', 'sku', 'titulo', 'descripcion', 'sala', 'posicion', 'tipoPieza',
  'tipoPiezaEsIlustrativo', 'naturaleza', 'cultura', 'epoca', 'material',
  'dimensiones_m', 'procedencia', 'fuentes', 'estadoEditorial', 'moneda',
  'precio', 'precioEsFicticio', 'stock', 'urlProducto', 'modelos', 'actualizadoEn'
];

const PERMITIDOS = {
  tipoPieza: ['original_documentado', 'replica', 'artesania_tradicional', 'artesania_contemporanea', null],
  naturaleza: ['producto', 'demostracion_no_vendible'],
  sala: ['recepcion', 'patio', 'galeria_sur', 'ceramica', 'textiles', 'metal', 'santuario', 'taller', null],
  estadoEditorial: ['pendiente', 'revisado', 'publicado'],
  moneda: ['USD', 'PEN', 'EUR']
};

const errores = [];
const error = (donde, mensaje) => errores.push(`  ✗ ${donde}: ${mensaje}`);

// 1. ¿Se puede leer como JSON?
let datos;
try {
  datos = JSON.parse(readFileSync(RUTA, 'utf8'));
} catch (e) {
  console.error(`✗ ${RUTA} no es JSON válido:\n  ${e.message}`);
  process.exit(1);
}

if (!Array.isArray(datos.piezas)) {
  console.error(`✗ ${RUTA}: falta la lista "piezas"`);
  process.exit(1);
}

// Posiciones de exhibición de la casa (para comprobar el campo `posicion`)
const posiciones = Object.fromEntries(
  JSON.parse(readFileSync('datos/salas.json', 'utf8')).posiciones.map((p) => [p.id, p])
);
const ocupadas = {};

// 2. Cada pieza
const ids = new Set();
const skus = new Set();

datos.piezas.forEach((p, i) => {
  const donde = p.id ? `pieza "${p.id}"` : `pieza n.º ${i + 1}`;

  for (const campo of CAMPOS) {
    if (!(campo in p)) error(donde, `falta el campo "${campo}" (si no se sabe, poner null)`);
  }
  for (const campo of Object.keys(p)) {
    if (!CAMPOS.includes(campo)) error(donde, `campo desconocido "${campo}" (¿error de escritura?)`);
  }
  for (const [campo, lista] of Object.entries(PERMITIDOS)) {
    if (campo in p && !lista.includes(p[campo])) {
      error(donde, `"${campo}" vale ${JSON.stringify(p[campo])}; permitidos: ${lista.map(v => JSON.stringify(v)).join(', ')}`);
    }
  }

  if (typeof p.id !== 'string' || p.id === '') error(donde, '"id" debe ser un texto');
  if (typeof p.titulo !== 'string' || p.titulo === '') error(donde, '"titulo" debe ser un texto');
  if (ids.has(p.id)) error(donde, `"id" repetido`);
  if (skus.has(p.sku)) error(donde, `"sku" repetido: ${p.sku}`);
  ids.add(p.id);
  skus.add(p.sku);

  if (p.posicion !== null && p.posicion !== undefined) {
    const pos = posiciones[p.posicion];
    if (!pos) {
      error(donde, `"posicion" ${JSON.stringify(p.posicion)} no existe en datos/salas.json (ej.: "C05", "S07")`);
    } else {
      if (p.sala !== pos.sala) error(donde, `la posición ${p.posicion} es de la sala "${pos.sala}", pero la pieza dice "sala": ${JSON.stringify(p.sala)}`);
      if (ocupadas[p.posicion]) error(donde, `la posición ${p.posicion} ya la ocupa la pieza "${ocupadas[p.posicion]}"`);
      ocupadas[p.posicion] = p.id;
    }
  }

  if (p.precio !== null && (typeof p.precio !== 'number' || p.precio < 0)) {
    error(donde, '"precio" debe ser un número (sin comillas) o null');
  }
  if (p.stock !== null && !Number.isInteger(p.stock)) {
    error(donde, '"stock" debe ser un número entero o null');
  }
  if (!Array.isArray(p.fuentes)) error(donde, '"fuentes" debe ser una lista: [] si no hay');
  if (!p.modelos || !('galeria' in p.modelos) || !('examen' in p.modelos)) {
    error(donde, '"modelos" debe tener "galeria" y "examen" (o null)');
  }
  if (p.dimensiones_m !== null) {
    const d = p.dimensiones_m;
    if (typeof d !== 'object' || !['alto', 'ancho', 'fondo'].every(k => typeof d[k] === 'number')) {
      error(donde, '"dimensiones_m" debe ser null o { "alto": 0.24, "ancho": 0.16, "fondo": 0.18 } en metros');
    }
  }
  if (p.naturaleza === 'producto' && p.tipoPiezaEsIlustrativo) {
    error(donde, 'un "producto" en venta no puede tener tipoPiezaEsIlustrativo: true');
  }
  if (p.naturaleza === 'producto' && p.tipoPieza === null) {
    error(donde, 'un "producto" en venta necesita tipoPieza (regla de DISENO_FINAL.md §7)');
  }
  if (p.naturaleza === 'producto' && p.tipoPieza === 'original_documentado' && p.fuentes.length === 0) {
    error(donde, 'un original documentado en venta necesita al menos una fuente');
  }
});

// 3. Resultado
if (errores.length > 0) {
  console.error(`✗ ${RUTA}: ${errores.length} error(es)\n${errores.join('\n')}`);
  process.exit(1);
}
console.log(`✓ ${RUTA}: ${datos.piezas.length} piezas correctas (${Object.keys(ocupadas).length} colocadas en la casa)`);
