// PRUEBAS AUTOMÁTICAS DEL ESTADO - ARTEANC VR (módulo 1.6)
//
// Uso: `npm run probar` (también se ejecuta antes de cada build).
// Usa el corredor de pruebas que trae Node (`node --test`), sin instalar nada.
// Cada `test` comprueba una regla; `assert` falla si algo no es lo esperado.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { crearEstado } from '../src/servicios/estado.js';

// Un localStorage de mentira, que guarda en memoria
function almacenFalso(inicial = {}) {
  const datos = { ...inicial };
  return {
    getItem: (k) => (k in datos ? datos[k] : null),
    setItem: (k, v) => { datos[k] = String(v); },
    datos
  };
}

test('empieza vacío: sin pieza seleccionada, sin favoritos, en español', () => {
  const e = crearEstado(almacenFalso());
  assert.equal(e.obtener('piezaSeleccionada'), null);
  assert.deepEqual(e.obtener('favoritos'), []);
  assert.equal(e.obtener('idioma'), 'es');
  assert.equal(e.obtener('modoSentado'), false);
});

test('alternarFavorito marca y desmarca', () => {
  const e = crearEstado(almacenFalso());
  assert.equal(e.alternarFavorito('pieza01'), true);
  assert.equal(e.esFavorito('pieza01'), true);
  assert.equal(e.alternarFavorito('pieza01'), false);
  assert.equal(e.esFavorito('pieza01'), false);
});

test('los favoritos se guardan y se recuperan al "volver a abrir"', () => {
  const almacen = almacenFalso();
  const primera = crearEstado(almacen);
  primera.alternarFavorito('pieza02');
  primera.alternarFavorito('pieza03');

  const segunda = crearEstado(almacen); // como recargar la página
  assert.deepEqual(segunda.obtener('favoritos'), ['pieza02', 'pieza03']);
});

test('la pieza seleccionada NO se guarda', () => {
  const almacen = almacenFalso();
  crearEstado(almacen).cambiar('piezaSeleccionada', 'pieza01');
  assert.equal(crearEstado(almacen).obtener('piezaSeleccionada'), null);
});

test('avisa a quien escucha, y solo cuando de verdad cambia', () => {
  const e = crearEstado(almacenFalso());
  const recibidos = [];
  const dejar = e.alCambiar('piezaSeleccionada', (valor, anterior) => recibidos.push([valor, anterior]));

  e.cambiar('piezaSeleccionada', 'pieza01');
  e.cambiar('piezaSeleccionada', 'pieza01'); // igual: no avisa
  e.cambiar('piezaSeleccionada', null);
  dejar();                                     // dejar de escuchar
  e.cambiar('piezaSeleccionada', 'pieza03');   // ya no llega

  assert.deepEqual(recibidos, [['pieza01', null], [null, 'pieza01']]);
});

test('nadie puede modificar la lista de favoritos desde fuera', () => {
  const e = crearEstado(almacenFalso());
  e.alternarFavorito('pieza01');
  const copia = e.obtener('favoritos');
  copia.push('trampa');
  assert.deepEqual(e.obtener('favoritos'), ['pieza01']);
});

test('datos guardados estropeados o extraños: se ignoran sin romper', () => {
  assert.deepEqual(crearEstado(almacenFalso({ 'arteanc.estado.v1': '{no es json' })).obtener('favoritos'), []);
  const raro = JSON.stringify({ favoritos: ['ok', 3, null], idioma: 'klingon' });
  const e = crearEstado(almacenFalso({ 'arteanc.estado.v1': raro }));
  assert.deepEqual(e.obtener('favoritos'), ['ok']);
  assert.equal(e.obtener('idioma'), 'es');
});

test('sin almacenamiento (navegación privada) funciona igual, sin guardar', () => {
  const e = crearEstado(undefined);
  assert.equal(e.alternarFavorito('pieza01'), true);
  assert.deepEqual(e.obtener('favoritos'), ['pieza01']);
});

test('el modo sentado empieza apagado y se recuerda al volver', () => {
  const almacen = almacenFalso();
  const primera = crearEstado(almacen);
  assert.equal(primera.obtener('modoSentado'), false);
  primera.cambiar('modoSentado', true);
  assert.equal(crearEstado(almacen).obtener('modoSentado'), true);
  // Un valor guardado que no es true/false se ignora
  const raro = crearEstado(almacenFalso({ 'arteanc.estado.v1': JSON.stringify({ modoSentado: 'si' }) }));
  assert.equal(raro.obtener('modoSentado'), false);
});

test('una clave desconocida es un error claro', () => {
  const e = crearEstado(almacenFalso());
  assert.throws(() => e.cambiar('favoritoz', []), /Clave desconocida/);
});
