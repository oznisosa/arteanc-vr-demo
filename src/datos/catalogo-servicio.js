// SERVICIO DEL CATÁLOGO - ARTEANC VR (módulo 1.2)
//
// Descarga el catálogo UNA sola vez y lo comparte con quien lo pida.
// `catalogoListo` es una promesa: cualquier módulo puede esperar a que llegue
// con `await catalogoListo` o `catalogoListo.then(...)`.

import { cargarCatalogo } from './cargar-catalogo.js';

export const catalogoListo = cargarCatalogo();
