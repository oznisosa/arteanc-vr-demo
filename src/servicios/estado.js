// ESTADO DE LA APLICACIÓN - ARTEANC VR (módulo 1.6)
//
// Una "memoria compartida" pequeña que cualquier parte del programa puede
// consultar o cambiar, y que AVISA cuando algo cambia:
//
//   piezaSeleccionada  id de la pieza cuya ficha está abierta (null = ninguna)
//   favoritos          lista de ids de piezas marcadas como favoritas
//   idioma             'es' (en la v1.1 llegará 'en')
//   modoSentado        true si el visitante usa el modo sentado (Fase 2, botón Y)
//
// Los favoritos, el idioma y el modo sentado se GUARDAN en el navegador (localStorage), así que
// siguen ahí al cerrar y volver a abrir la página (DISENO_FINAL.md §7:
// "Favoritos es una selección local persistente"). La pieza seleccionada no
// se guarda: al volver, ninguna ficha está abierta.
//
// Uso:
//   import { estado } from './servicios/estado.js';
//   estado.obtener('favoritos')                 → ['pieza02']
//   estado.alternarFavorito('pieza01')          → true (ahora es favorita)
//   estado.alCambiar('favoritos', (lista) => …) → se llama en cada cambio;
//                                                 devuelve una función para dejar de escuchar

const CLAVE_GUARDADO = 'arteanc.estado.v1';  // nombre en localStorage
const GUARDADOS = ['favoritos', 'idioma', 'modoSentado']; // lo que sobrevive al cerrar
const IDIOMAS = ['es'];                       // idiomas disponibles

const INICIAL = {
  piezaSeleccionada: null,
  favoritos: [],
  idioma: 'es',
  modoSentado: false
};

// Lee lo guardado. Si no hay nada o está estropeado, se empieza de cero.
function leerGuardado(almacen) {
  try {
    const datos = JSON.parse(almacen?.getItem(CLAVE_GUARDADO) ?? '{}');
    const resultado = {};
    if (Array.isArray(datos.favoritos)) {
      resultado.favoritos = datos.favoritos.filter((id) => typeof id === 'string');
    }
    if (IDIOMAS.includes(datos.idioma)) resultado.idioma = datos.idioma;
    if (typeof datos.modoSentado === 'boolean') resultado.modoSentado = datos.modoSentado;
    return resultado;
  } catch {
    return {};
  }
}

// localStorage existe en el navegador; en Node (pruebas) no, y se pasa uno falso
function almacenDelNavegador() {
  try { return globalThis.localStorage; } catch { return undefined; }
}

export function crearEstado(almacen = almacenDelNavegador()) {
  const datos = { ...INICIAL, ...leerGuardado(almacen) };
  const avisos = new EventTarget();

  function guardar() {
    try {
      const aGuardar = Object.fromEntries(GUARDADOS.map((k) => [k, datos[k]]));
      almacen?.setItem(CLAVE_GUARDADO, JSON.stringify(aGuardar));
    } catch {
      // Navegación privada o almacenamiento lleno: se sigue sin guardar
    }
  }

  function cambiar(clave, valor) {
    if (!(clave in INICIAL)) throw new Error(`[estado] Clave desconocida: ${clave}`);
    const anterior = datos[clave];
    // Las listas se copian: así nadie modifica el estado "por la puerta de atrás"
    datos[clave] = Array.isArray(valor) ? [...valor] : valor;
    if (JSON.stringify(anterior) === JSON.stringify(datos[clave])) return; // sin cambios, sin aviso
    if (GUARDADOS.includes(clave)) guardar();
    avisos.dispatchEvent(new CustomEvent(clave, { detail: { valor: obtener(clave), anterior } }));
  }

  function obtener(clave) {
    const valor = datos[clave];
    return Array.isArray(valor) ? [...valor] : valor;
  }

  return {
    obtener,
    cambiar,

    // Escuchar los cambios de una clave
    alCambiar(clave, funcion) {
      const oyente = (e) => funcion(e.detail.valor, e.detail.anterior);
      avisos.addEventListener(clave, oyente);
      return () => avisos.removeEventListener(clave, oyente);
    },

    // Atajos para los favoritos
    esFavorito: (id) => datos.favoritos.includes(id),
    alternarFavorito(id) {
      const lista = datos.favoritos.includes(id)
        ? datos.favoritos.filter((x) => x !== id)
        : [...datos.favoritos, id];
      cambiar('favoritos', lista);
      return lista.includes(id);
    },

    // Todo junto (para depurar)
    instantanea: () => JSON.parse(JSON.stringify(datos))
  };
}

// El estado único de la aplicación
export const estado = crearEstado();
