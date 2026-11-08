// TEXTOS DE LA INTERFAZ - ARTEANC VR (módulo 1.5)
//
// Todos los textos que ve el visitante están en `datos/textos/es.json`, no
// escritos dentro del código. Así se corrigen sin tocar el programa y, en la
// versión 1.1, se añadirá `en.json` para el inglés.
//
// Uso:
//   import { t } from './datos/textos.js';
//   t('ficha.cerrar')                          → "CERRAR"
//   t('ficha.precioFicticio', { importe: 'US$ 35.00' }) → "Precio ficticio: US$ 35.00"
//
// Vite incluye el JSON dentro del código al construir (import de JSON), así
// que los textos están disponibles al instante, sin esperar a la red.

import es from '../../datos/textos/es.json';

const textos = es;

export function t(clave, valores = {}) {
  // "ficha.cerrar" → textos.ficha.cerrar
  const texto = clave.split('.').reduce((nodo, parte) => nodo?.[parte], textos);

  if (typeof texto !== 'string') {
    console.warn('[textos] Falta el texto:', clave);
    return clave; // se ve la clave: así se nota que falta
  }

  // Sustituir {marcadores} por sus valores
  return texto.replace(/\{(\w+)\}/g, (_, nombre) => String(valores[nombre] ?? `{${nombre}}`));
}
