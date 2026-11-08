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
- Prototipo funcional de una sola sala en `index.html` + `app.js` + `catalogo.js`.
  Su inventario está en [docs/MAPA_ESCENA.md](docs/MAPA_ESCENA.md).
- Diseño final de "La Casa ArteAnc" congelado en `docs/diseno/final/`.
- Limpieza del repositorio hecha (módulo 0.1).
- **Siguiente paso: resto de la Fase 0 (Cimientos).** Orden sugerido:
  ~~0.2 Node + Vite~~ ✅ → ~~0.3 prueba en el Quest~~ ✅ → 0.4 módulos JS →
  0.5 medidor de fps con `?debug` → 0.6 publicación → 0.7 `docs/PRUEBAS.md`.
  La escena visible **no debe cambiar** en la Fase 0.

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
   - Al proponer un commit, listar los archivos explícitamente (nunca `git add .`)
     y dar los comandos para que Ozni los ejecute y aprenda.
4. **Español** en documentos, comentarios del código y textos de la escena.
5. **No inventar datos** de productos ni atribuciones culturales.
   `null` = desconocido. Las piezas de prueba se marcan como ilustrativas.
6. **Coordenadas del diseño final:** 1 unidad = 1 m; origen en el umbral sur;
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
- Mientras `app.js` y `catalogo.js` sean scripts clásicos, `vite.config.js` los
  copia a `dist/` junto con `modelos/` (se quitará en el módulo 0.4).
- El modo VR del Quest 3 lo prueba Ozni en el visor; pedirle confirmación y anotar el resultado en la bitácora.
- `file://` no sirve: los `.glb` necesitan HTTP.
