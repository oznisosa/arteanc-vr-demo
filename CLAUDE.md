# ArteAnc VR — Instrucciones para Claude Code

Tienda-museo virtual de **ArteAnc** (arte andino y precolombino) para **Meta Quest 3**
en el navegador (WebXR) y para escritorio. Construida con **A-Frame 1.8.0**.
El propietario, Ozni, aprende desarrollo mientras se construye el proyecto.
**ChatGPT es su tutor** y lee los cambios en GitHub (`oznisosa/arteanc-vr-demo`).

## Leer antes de trabajar
1. [docs/PLAN_MAESTRO.md](docs/PLAN_MAESTRO.md): fases, módulos y criterios de finalización.
2. [docs/diseno/final/DISENO_FINAL.md](docs/diseno/final/DISENO_FINAL.md) y
   [docs/diseno/final/02-layout.json](docs/diseno/final/02-layout.json): el
   **diseño congelado v1.0**. Manda sobre cualquier imagen.
3. [docs/DECISIONES.md](docs/DECISIONES.md): por qué se decidió cada cosa.
4. Las últimas entradas de [docs/BITACORA.md](docs/BITACORA.md).

## Estado actual (2026-11-08)
- Prototipo funcional de una sola sala: `index.html` (escena) + código en `src/`
  (módulos ES; entrada `src/main.js`).
  Su inventario está en [docs/MAPA_ESCENA.md](docs/MAPA_ESCENA.md).
- Diseño final de "La Casa ArteAnc" congelado en `docs/diseno/final/`.
- **Fase 0 (Cimientos) terminada el 2026-11-08:** Vite, `npm run quest`,
  módulos en `src/`, medidor `?debug`, publicación con GitHub Actions y
  [docs/PRUEBAS.md](docs/PRUEBAS.md).
- **Fase 1 (Datos y componentes) en curso.** Hecho: 1.1 (`datos/catalogo.json`,
  guía [docs/CATALOGO.md](docs/CATALOGO.md), `npm run validar`).
  Hecho: 1.2 (`pieza-exhibida`) y 1.3 (`ficha-producto`, ficha junto a la pieza).
  Hecho: 1.4 (`datos/salas.json` generado con `npm run salas`, DT-015; guía
  [docs/SALAS.md](docs/SALAS.md)). 1.7 greybox construido en `casa.html` (DT-016,
  componente `src/constructor/casa-greybox.js`); probado en el Quest: 90 fps.
  Después: 1.5 textos y fuente MSDF, 1.6 estado.
  Ver el plan para el orden y los criterios.
- **Fase 2 (Movimiento y confort) en curso en paralelo (DT-030)**, en la rama
  `fase-2` y la carpeta `C:\arteanc\ArteAnc-VR-fase2` (worktree). Hecho:
  2.1 Teletransporte (joystick derecho, DT-031; probado en el Quest).
  2.2 Giro por pasos de 30° (probado en el Quest).
  2.3 Áreas transitables (mapa 2D propio, DT-032; también en `casa.html`;
  probado en el Quest). 2.4 Modo sentado (botón Y, DT-033; probado
  en el Quest). Siguiente: 2.5 Manos o 2.6 Escritorio y móvil.
  La Fase 1 sigue en `main`, en la otra carpeta, con otra sesión.
- Pendiente de Ozni: números de `?debug` dentro de VR (PRUEBAS.md §4).

## Reglas de trabajo
1. **Documentar siempre, a medida que se avanza.** Por cada cambio:
   - Una entrada nueva **arriba** en `docs/BITACORA.md`. Incluye: qué cambió
     (archivos y valores antes/después), por qué, conceptos que aparecen, cómo
     se verificó, ejercicio sugerido y pendientes. Escrita para que ChatGPT pueda enseñar con ella.
   - En `docs/PLAN_MAESTRO.md`, marcar ✅ los módulos terminados, con fecha.
   - Cada decisión técnica nueva, en `docs/DECISIONES.md` (DT-0XX).
   - Si cambian coordenadas de la escena, actualizar `docs/MAPA_ESCENA.md`.
2. **Cambios pequeños y verificables.** Un módulo del plan cada vez, probado antes de seguir.
3. **Git:**
   - No hacer commit ni push si Ozni no lo pide.
   - Se trabaja directamente en `main` (DT-011). Como `main` publica la web,
     **antes de cada push** la escena se prueba en local y debe funcionar igual o mejor.
   - **Excepción (DT-030):** la Fase 2 se trabaja en la rama `fase-2`, en
     `C:\arteanc\ArteAnc-VR-fase2`. Desde esa carpeta no tocar la carpeta de
     `main` (la usa la sesión de la Fase 1).
     - Decisiones: Fase 1 usa DT-015 a DT-029; Fase 2, **DT-030 en adelante**.
     - Archivos de la Fase 2: `src/componentes/caminar-quest.js`, componentes
       nuevos de movimiento y el bloque `#jugador` de `index.html`. **No tocar**
       las entidades de producto/ficha/recepción de `index.html`,
       `src/interaccion/ficha.js`, `src/datos/`, `datos/catalogo.json` ni
       `src/componentes/pieza-exhibida.js`.
     - En `src/main.js`, los imports de la Fase 2 van en un bloque con el
       comentario `// FASE 2 - movimiento`.
     - Puertos de prueba: **5174** (dev: `npx vite --port 5174 --strictPort --open false`)
       y **4174** (preview). Al cerrar servidores, filtrar los `node.exe` por
       `C:\arteanc\ArteAnc-VR-fase2\node_modules`, para no cerrar los de la otra sesión.
     - Para unir: actualizar `fase-2` con `main` (`git merge main` o
       `git rebase main`, lo decide Ozni), probar, y luego `git merge fase-2` en `main`.
       En los documentos compartidos, conservar las entradas de ambas ramas.
   - Al proponer un commit, listar los archivos explícitamente (nunca `git add .`)
     y dar los comandos para que Ozni los ejecute y aprenda.
4. **Español** en documentos, comentarios del código y textos de la escena.
5. **No inventar datos** de productos ni atribuciones culturales.
   `null` = desconocido. Las piezas de prueba se marcan como ilustrativas.
6. **Coordenadas del diseño final** (`datos/salas.json` se genera de `02-layout.json`; no editarlo a mano): 1 unidad = 1 m; origen en el umbral sur;
   X = este; Y = arriba; norte = −Z. En `02-layout.json`, `rooms.size` son
   **medidas libres interiores** `[ancho X, alto Y, fondo Z]`: no restar el muro otra vez.
7. **Rendimiento (Quest 3):** respetar el presupuesto de
   [docs/ARQUITECTURA.md](docs/ARQUITECTURA.md) §5 (72 fps, < 100 draw calls,
   250 000 triángulos, piezas de galería ≤ 3 MB).
   **La fidelidad de las piezas manda** (DT-012): la versión de examen puede
   pesar más (~10 MB) porque se carga sola, una a la vez.
8. **Archivos pesados fuera de Git:** las carpetas `_archivo/` (entregas
   originales) y `_fuentes-3d/` (escaneos y `.blend`) son locales e ignoradas.
   En `modelos/` solo van modelos optimizados.

## Entorno y pruebas
- Windows 11 · PowerShell · Node v24 · npm 11 · Python 3.14 · Git 2.55.
- **Servidor local (permitido sin preguntar):** `npx vite --open false` en segundo
  plano (puerto 5173); para probar el build, `npm run build` y
  `npx vite preview` (puerto 4173). Abrir con Playwright para clics y capturas
  (guardar en `.playwright-mcp/`, carpeta ignorada). Borrar `dist/` al terminar.
- Ozni usa `npm run dev`, que abre el navegador solo, y `npm run quest` para el
  visor (HTTPS autofirmado por wifi; IP del PC: 192.168.200.6 por Ethernet).
- **Publicación (DT-013):** cada push a `main` ejecuta
  `.github/workflows/publicar.yml` (GitHub Actions): `npm ci` → `npm run build`
  → publica `dist/` en GitHub Pages. Si el build falla, no se publica.
  **Antes de cada push: la prueba rápida de [docs/PRUEBAS.md](docs/PRUEBAS.md) §1.**
  Si un cambio añade algo visible, añadir su comprobación a PRUEBAS.md.
- `vite.config.js` copia `modelos/` a `dist/` en el build (Vite no ve los
  `.glb` porque se cargan desde el HTML).
- **Al terminar las pruebas, cerrar los servidores de verdad:** detener la tarea
  no cierra el proceso `node` de Vite. Cerrar los `node.exe` cuya línea de
  comandos contenga `C:\arteanc\ArteAnc-VR\node_modules` **y** `--strictPort`.
  **No** cerrar los de Ozni (sin `--strictPort`, p. ej. su `npm run quest`) ni
  los del worktree `ArteAnc-VR-fase2`.
- **Trabajo en paralelo (desde el 2026-11-08, DT-030 en la rama `fase-2`):**
  otra sesión hace la Fase 2 en el worktree `C:\arteanc\ArteAnc-VR-fase2`.
  Fase 1 (aquí) usa DT-015 a DT-029 y los puertos 5173/4173; Fase 2 usa DT-030+
  y 5174/4174. Aquí no se toca `caminar-quest.js` ni el bloque `#jugador` de
  `index.html`. La sesión que programa la Fase 2 es `arteanc-vr-fase2-27`.
  `casa.html` usa los mismos ids de jugador (`#jugador`, `#camara`,
  `#mando-izquierdo`, `#mando-derecho`) y un movimiento provisional
  (`src/casa/mover-provisional.js`) que se borrará al fusionar la Fase 2.
- **Prueba de equivalencia:** el mismo script de Playwright en la web
  publicada y en local debe dar el mismo resultado (modelo 0,650 m con base en
  y 1,000; esfera y cono con base en 1,000; 24 baldosas; 3 fichas; puertas; recepción).
- El modo VR del Quest 3 lo prueba Ozni en el visor; pedirle confirmación y anotar el resultado en la bitácora.
- `file://` no sirve: los `.glb` necesitan HTTP.
