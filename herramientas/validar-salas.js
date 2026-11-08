// VALIDAR LOS DATOS DE LAS SALAS - ARTEANC VR (módulo 1.4)
//
// Se ejecuta con `npm run validar` (y por tanto antes de cada build).
// Comprueba que `datos/salas.json`:
//   1. está AL DÍA con el diseño (02-layout.json): si alguien lo editó a mano
//      o cambió el diseño sin regenerarlo, avisa;
//   2. tiene una geometría coherente:
//      - las salas no se solapan;
//      - cada acceso está en el muro que separa las dos salas que une;
//      - cada posición de exhibición cae dentro de su sala (las hornacinas,
//        dentro del espesor de su muro);
//      - las cantidades de piezas por sala coinciden con las del diseño;
//   3. las salas que usa el catálogo existen.

import { readFileSync } from 'node:fs';
import { generarSalas, leerDiseno, textoSalas, RUTA_SALAS } from './generar-salas.js';

const errores = [];
const error = (m) => errores.push(`  ✗ ${m}`);
const TOL = 0.001; // tolerancia de 1 mm para comparar medidas

// 1. ¿Está al día?
const diseno = leerDiseno();
const esperado = textoSalas(generarSalas(diseno));
let actual;
try {
  actual = readFileSync(RUTA_SALAS, 'utf8');
} catch {
  console.error(`✗ Falta ${RUTA_SALAS}. Ejecuta: npm run salas`);
  process.exit(1);
}
if (actual.replace(/\r\n/g, '\n') !== esperado) {
  console.error(`✗ ${RUTA_SALAS} no coincide con el diseño (¿editado a mano o diseño cambiado?).\n  Ejecuta: npm run salas`);
  process.exit(1);
}
const datos = JSON.parse(actual);

// Rectángulo en planta de una sala: { x: [min, max], z: [min, max] }
function rect(sala) {
  const [cx, , cz] = sala.centro;
  const [ancho, , fondo] = sala.tamano;
  return { x: [cx - ancho / 2, cx + ancho / 2], z: [cz - fondo / 2, cz + fondo / 2] };
}
const salas = Object.fromEntries(datos.salas.map((s) => [s.id, s]));
const dentro = (v, [a, b], margen = 0) => v >= a - margen - TOL && v <= b + margen + TOL;
const g = datos.grosorMuro;

// 2a. Salas sin solapes
const lista = datos.salas;
for (let i = 0; i < lista.length; i++) {
  for (let j = i + 1; j < lista.length; j++) {
    const a = rect(lista[i]);
    const b = rect(lista[j]);
    const solapeX = Math.min(a.x[1], b.x[1]) - Math.max(a.x[0], b.x[0]);
    const solapeZ = Math.min(a.z[1], b.z[1]) - Math.max(a.z[0], b.z[0]);
    if (solapeX > TOL && solapeZ > TOL) error(`las salas ${lista[i].id} y ${lista[j].id} se solapan`);
  }
}

// 2b. Cada acceso, en el muro entre sus dos salas
for (const d of datos.accesos) {
  const [x, , z] = d.centro;
  for (const id of [d.desde, d.hacia]) {
    if (id === 'exterior') continue;
    const s = salas[id];
    if (!s) { error(`acceso ${d.id}: la sala "${id}" no existe`); continue; }
    const r = rect(s);
    // El centro del acceso debe estar en el borde de la sala (± medio muro) y dentro del tramo del muro
    const enBorde = d.muro === 'este-oeste'
      ? (Math.abs(z - r.z[0]) <= g / 2 + d.fondo / 2 + TOL || Math.abs(z - r.z[1]) <= g / 2 + d.fondo / 2 + TOL) && dentro(x, r.x)
      : (Math.abs(x - r.x[0]) <= g / 2 + d.fondo / 2 + TOL || Math.abs(x - r.x[1]) <= g / 2 + d.fondo / 2 + TOL) && dentro(z, r.z);
    if (!enBorde) error(`acceso ${d.id} (${x}, ${z}) no está en un muro de la sala ${id}`);
  }
  if (d.anchoSuperior > d.anchoBase) error(`acceso ${d.id}: el trapecio está al revés (arriba más ancho que abajo)`);
}

// 2c. Cada posición, dentro de su sala
const cuenta = {};
for (const p of datos.posiciones) {
  const s = salas[p.sala];
  if (!s) { error(`posición ${p.id}: la sala "${p.sala}" no existe`); continue; }
  cuenta[p.sala] = (cuenta[p.sala] ?? 0) + 1;
  const r = rect(s);
  const [x, y, z] = p.apoyo;
  // Las hornacinas están metidas en el muro: se permite el espesor del muro
  const margen = p.tipo === 'hornacina' ? g : 0;
  if (!dentro(x, r.x, margen) || !dentro(z, r.z, margen)) {
    error(`posición ${p.id} (${x}, ${z}) cae fuera de la sala ${p.sala}`);
  }
  if (y <= 0 || y > s.tamano[1]) error(`posición ${p.id}: altura de apoyo ${y} m fuera de la sala`);
}

// 2d. Cantidades por sala como en el diseño
const previstas = diseno.architecture.exhibitionCounts;
for (const [sala, n] of Object.entries(previstas)) {
  if ((cuenta[sala] ?? 0) !== n) error(`la sala ${sala} tiene ${cuenta[sala] ?? 0} posiciones; el diseño prevé ${n}`);
}

// 3. Las salas del catálogo existen
const catalogo = JSON.parse(readFileSync('datos/catalogo.json', 'utf8'));
for (const pieza of catalogo.piezas) {
  if (pieza.sala !== null && !salas[pieza.sala]) error(`la pieza ${pieza.id} usa la sala "${pieza.sala}", que no existe en ${RUTA_SALAS}`);
}

if (errores.length > 0) {
  console.error(`✗ ${RUTA_SALAS}: ${errores.length} error(es)\n${errores.join('\n')}`);
  process.exit(1);
}
console.log(`✓ ${RUTA_SALAS}: al día con el diseño; ${datos.salas.length} salas, ${datos.accesos.length} accesos y ` +
  `${datos.posiciones.length} posiciones con geometría correcta`);
