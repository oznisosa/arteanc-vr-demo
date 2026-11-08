// Configuración de Vite para ArteAnc VR (módulo 0.2 de la Fase 0).
//
// Vite hace dos cosas:
//   - `npm run dev`:   servidor local con recarga automática al guardar.
//   - `npm run build`: genera en `dist/` la versión lista para publicar.
//
// El código está en `src/` como módulos ES (módulo 0.4) y Vite lo empaqueta.
// Los modelos `.glb` se cargan desde el HTML con `url(./modelos/…)`, que Vite
// no ve; por eso, al terminar el build, copiamos `modelos/` a `dist/`.
// En el módulo 0.6 pasarán a `public/modelos/` y esto desaparecerá.

// Modo "quest" (módulo 0.3): `npm run quest` abre el servidor a la red local
// con HTTPS, para entrar desde el navegador del Quest 3 por wifi. WebXR solo
// funciona en páginas seguras (HTTPS o localhost). El certificado es
// autofirmado: el navegador avisará la primera vez y hay que aceptarlo.

import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { cpSync } from 'node:fs';

// Carpetas que la escena carga directamente y que Vite no ve por sí solo.
const ARCHIVOS_A_COPIAR = ['modelos'];

function copiarModelos() {
  return {
    name: 'copiar-modelos',
    apply: 'build', // solo al ejecutar `npm run build`
    closeBundle() {
      for (const ruta of ARCHIVOS_A_COPIAR) {
        cpSync(ruta, `dist/${ruta}`, { recursive: true });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const paraQuest = mode === 'quest';

  return {
    // Rutas relativas: la web funciona igual en GitHub Pages
    // (que la sirve desde /arteanc-vr-demo/) y en local.
    base: './',

    // No hay carpeta `public/` todavía; evitamos que Vite busque una.
    publicDir: false,

    server: {
      port: 5173,
      open: !paraQuest, // en el PC abre el navegador; para el Quest, no
      host: paraQuest,  // true = visible desde otros equipos de la red local
    },

    plugins: [
      copiarModelos(),
      ...(paraQuest ? [basicSsl()] : []), // HTTPS solo en modo quest
    ],
  };
});
