// Configuración de Vite para ArteAnc VR (módulo 0.2 de la Fase 0).
//
// Vite hace dos cosas:
//   - `npm run dev`:   servidor local con recarga automática al guardar.
//   - `npm run build`: genera en `dist/` la versión lista para publicar.
//
// Mientras `app.js` y `catalogo.js` sean scripts clásicos (sin `import`),
// Vite no los empaqueta. Por eso, al terminar el build, los copiamos a `dist/`
// junto con los modelos. Esto desaparecerá en el módulo 0.4 (módulos JS).

import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';

// Archivos que la escena carga directamente y que Vite no ve por sí solo.
const ARCHIVOS_A_COPIAR = ['app.js', 'catalogo.js', 'modelos'];

function copiarArchivosClasicos() {
  return {
    name: 'copiar-archivos-clasicos',
    apply: 'build', // solo al ejecutar `npm run build`
    closeBundle() {
      for (const ruta of ARCHIVOS_A_COPIAR) {
        cpSync(ruta, `dist/${ruta}`, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  // Rutas relativas: la web funciona igual en GitHub Pages
  // (que la sirve desde /arteanc-vr-demo/) y en local.
  base: './',

  // No hay carpeta `public/` todavía; evitamos que Vite busque una.
  publicDir: false,

  server: {
    port: 5173,
    open: true, // abre el navegador al arrancar
  },

  plugins: [copiarArchivosClasicos()],
});
