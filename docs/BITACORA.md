# Bitácora de cambios — ArteAnc VR

> **Nota para ChatGPT (tutor):** este archivo lo escribe Claude Code cada vez que
> modifica el proyecto junto con Ozni. Cada entrada explica qué cambió, por qué
> y qué conceptos aparecen, para que puedas usarla como material de enseñanza.
> El mapa de coordenadas de la escena está en `docs/MAPA_ESCENA.md`.
> Las entradas más recientes van primero.

---

## 2026-11-08 — Módulo 0.5: medidor de rendimiento con `?debug`

**Tipo:** herramienta de medición. **El visitante no ve ningún cambio** (sin
`?debug` no aparece nada).

### Qué cambió
| Archivo | Qué es |
|---|---|
| `src/componentes/medidor-rendimiento.js` (nuevo) | Componente A-Frame: panel negro con texto verde que muestra **fps**, **llamadas de dibujo** y **triángulos**, actualizado cada 0,5 s |
| `src/depuracion.js` (nuevo) | Lee la dirección; si contiene `?debug`, activa el panel `stats` de A-Frame y cuelga el medidor de la cámara (a 0,8 m, abajo a la izquierda) |
| `src/main.js` | Dos líneas: `if (modoDepuracionActivo()) activarDepuracion();` |
| `README.md` | Cómo usar `?debug` |

¿Por qué un panel propio? El panel `stats` de A-Frame es HTML: se ve en el PC
pero **desaparece dentro del visor**. El medidor propio es una entidad 3D
pegada a la cámara, así que se lee también en VR.

### Primera medición (PC, Chrome de Playwright, vista inicial)
| Métrica | Valor | Presupuesto (ARQUITECTURA §5) |
|---|---|---|
| fps | 60 (límite de la pantalla del PC) | 72 en el Quest |
| Llamadas de dibujo | **34** | < 100 ✅ |
| Triángulos en vista | **104 015** | < 250 000 ✅ |
| …de ellos, el modelo `Untitle123d.glb` | **97 075 (93 %)** | galería 5–15 mil ❌ · examen ≤ 100 mil ✅ |
| Mallas visibles en la escena | 68 | — |

**Lectura:** la sala vacía cuesta muy poco (unos 7 000 triángulos); casi todo
es el único modelo 3D. Con 20 piezas así se pasaría de 1,9 millones de
triángulos. Esto confirma la DT-012: en la sala, versión de galería ligera;
la detallada, solo al examinar.

**Medición en el Quest 3 (pendiente, la hace Ozni):**
| Métrica | Fuera de VR | Dentro de VR |
|---|---|---|
| fps | | |
| llamadas | | |
| triángulos | | |
(En VR se dibuja una vez por ojo: llamadas y triángulos salen aproximadamente al doble.)

### Cómo se verificó
- `http://localhost:5173/?debug`: aparece el panel de A-Frame (arriba a la
  izquierda) y el medidor propio con "PC fps: 60 · llamadas: 34 · triangulos: 104.015".
- `http://localhost:5173/` (sin `?debug`): ni panel ni medidor.

### Conceptos que aparecen
- **fps (fotogramas por segundo).** Por debajo de 72 en el Quest, la imagen
  tiembla y marea. Es la métrica más importante en VR.
- **Llamada de dibujo (*draw call*).** Cada vez que la CPU le pide a la GPU que
  dibuje un objeto. Muchas llamadas saturan la CPU aunque haya pocos triángulos.
- **Triángulos.** Cada modelo 3D está hecho de triángulos; más triángulos = más
  trabajo para la GPU.
- **`renderer.info`.** Contadores de Three.js con lo dibujado en el último fotograma.
- **Parámetros de la URL (*query string*).** Lo que va tras `?`. Se lee con
  `URLSearchParams`. Sirve para activar opciones sin cambiar el código.
- **Medir antes de optimizar.** Sin números no se sabe qué optimizar; aquí el
  número dice claramente que el problema es el modelo, no la sala.

### Para el tutor
- Ejercicio: abrir `?debug`, acercarse al modelo y alejarse. ¿Cambian los
  triángulos? ¿Por qué no? (Pista: no hay LOD todavía.)
- Ejercicio: cerrar la ficha y abrirla. ¿Cuántas llamadas de dibujo añade?
- Pregunta: si el modelo es el 93 % de los triángulos, ¿qué ganaríamos
  reduciéndolo a 10 000?

### Pendientes
- Ozni mide en el Quest (fuera y dentro de VR) y se completa la tabla.
- Siguiente: módulo 0.6 (publicación automática).

---

## 2026-11-08 — Módulo 0.4: el código dividido en módulos (`src/`)

**Tipo:** reorganización del código. **La escena no cambió.**

### Qué cambió
**Antes:** dos scripts clásicos al final de `index.html`:
```html
<script src="./catalogo.js"></script>   <!-- define window.catalogoArteAnc -->
<script src="./app.js"></script>        <!-- 244 líneas: todo lo demás -->
```
**Ahora:** un solo módulo de entrada:
```html
<script type="module" src="./src/main.js"></script>
```
y el código repartido por responsabilidad:

| Archivo nuevo | Viene de | Exporta |
|---|---|---|
| `src/main.js` | — | nada: importa todo y lo pone en marcha |
| `src/datos/catalogo.js` | `catalogo.js` | `catalogo` |
| `src/componentes/caminar-quest.js` | `app.js` (joystick) | nada: registra el componente al importarse |
| `src/escena/suelo.js` | `app.js` (baldosas) | `crearBaldosas()` |
| `src/escena/ajustar-modelo.js` | `app.js` (ajuste del modelo) | `ajustarModeloAPedestal(selector, tamanoMaximo, alturaApoyo)` |
| `src/interaccion/ficha.js` | `app.js` (ficha) | `iniciarFicha(catalogo)` |
| `src/interaccion/puertas.js` | `app.js` (puertas) | `iniciarPuertas()` |
| `src/interaccion/recepcion.js` | `app.js` (recepción) | `iniciarRecepcion()` |

- `app.js` y `catalogo.js` se **borraron** con `git rm` (siguen en el historial).
- `window.catalogoArteAnc` ya no existe: el catálogo se pasa como parámetro.
- El ajuste del modelo ahora recibe sus números (0,65 m y 1,02 m) como
  parámetros en `main.js`, en lugar de tenerlos escritos dentro.
- `caminar-quest` usa `AFRAME.THREE` en vez de la variable global `THREE`
  (es el mismo objeto, pero así la dependencia se ve).
- `vite.config.js`: el plugin ahora se llama `copiar-modelos` y solo copia
  `modelos/` (el código ya lo empaqueta Vite en `dist/assets/index-….js`, 4 kB).
- Los textos de la escena **no** se tocaron (siguen sin tildes hasta el 1.5).

### Por qué sigue funcionando en GitHub Pages
Los navegadores entienden `import`/`export` sin Vite, siempre que las rutas
sean relativas (`./…`). Por eso la web publicada desde la raíz de `main`
funciona igual. Vite solo hace falta para el desarrollo y para `dist/`.

### Cómo se verificó (prueba de equivalencia)
Un mismo script de Playwright se ejecutó en 4 lugares: la **web publicada**
(código viejo, como referencia), `npm run dev`, `dist/` con `npm run preview`
y los archivos servidos tal cual con Python (como GitHub Pages). Los 4 dieron
**el mismo resultado**:
- modelo: dimensión mayor 0,650 m, base en y 1,020;
- 24 baldosas; componente `caminar-quest` presente;
- fichas: "CERAMICA 01", "MODELO 3D DE PRUEBA", "FIGURA 03"; se cierra bien;
- puertas: ambos letreros cambian a "CERRAR" y vuelven a "ABRIR";
- recepción: el letrero pasa de oculto a visible.

En las 3 versiones nuevas también se simuló el joystick: el rig se desplaza
(0,72–0,74 m en 0,6 s). Único error en consola: falta `favicon.ico` (ya pasaba).
**Pendiente:** Ozni lo prueba en el Quest con `npm run quest`.

### Observación (sin corregir: la Fase 0 no cambia el comportamiento)
En la simulación, joystick hacia delante movió el rig hacia +z (sur). Puede
que en el visor el movimiento vaya al revés. Anotado en `MAPA_ESCENA.md`.

### Incidente: servidores que no se cerraban
Al detener las pruebas del 0.2, los procesos `node` de Vite siguieron abiertos
y ocuparon los puertos 5173 y 4173. Al limpiarlos también se cerró un
`npm run quest` de Ozni (ya había terminado su prueba). Se anotó en
`CLAUDE.md` cómo cerrarlos sin tocar los de Ozni.

### Conceptos que aparecen
- **Módulo ES.** Archivo con su propio ámbito: lo que no se `export`a, no se ve fuera.
- **`import` / `export`.** Cómo un módulo pide y ofrece funciones o datos.
- **Punto de entrada.** El único archivo que carga el HTML (`main.js`).
- **Importación por efecto secundario.** `import './componentes/caminar-quest.js'`
  no trae nada; solo ejecuta el archivo (que registra el componente).
- **Variables globales frente a parámetros.** Pasar `catalogo` a `iniciarFicha`
  deja claro de qué depende la función.
- **Refactorizar.** Cambiar la estructura del código sin cambiar lo que hace;
  por eso se comprueba con una prueba de equivalencia.

### Para el tutor
- Ejercicio: agregar una pieza `pieza04` a `src/datos/catalogo.js` y explicar
  qué más faltaría en `index.html` para que aparezca (respuesta: la entidad con
  `id="pieza04"` y la clase `producto`). Es justo lo que resolverá la Fase 1.
- Pregunta: ¿por qué `caminar-quest.js` no exporta nada y aun así hace falta importarlo?
- Ejercicio: en el navegador, abrir las herramientas de desarrollo → Red y ver
  cómo `npm run dev` carga cada módulo por separado, mientras `dist/` carga uno solo.

### Pendientes
- Prueba de Ozni en el Quest (y comprobar la dirección del joystick).
- Siguiente: módulo 0.5 (medidor de fps con `?debug`).

---

## 2026-11-08 — Módulo 0.3: abrir la escena en el Quest 3 por wifi

**Tipo:** herramientas de desarrollo. **La escena no cambió.**
**Archivos:** `package.json` (orden `quest` y dependencia nueva), `vite.config.js`,
`README.md`, `CLAUDE.md`, `docs/PLAN_MAESTRO.md`.

### Qué cambió
- **Nueva orden `npm run quest`** (= `vite --mode quest`). En ese modo:
  - `server.host: true`: el servidor escucha en la red local, no solo en el PC.
  - Plugin **`@vitejs/plugin-basic-ssl`** (2.3.0): sirve por **HTTPS** con un
    certificado **autofirmado** generado al momento.
  - No abre el navegador del PC.
- **`npm run dev` sigue igual** (HTTP, solo `localhost`, abre el navegador):
  así en el PC no aparece el aviso del certificado.
- Se eligió **wifi** en lugar de cable USB (`adb reverse`) porque no requiere
  activar el modo desarrollador del Quest ni instalar herramientas de Android.

### Por qué hace falta HTTPS
WebXR solo funciona en un **contexto seguro**: `https://` o `localhost`. Desde
el Quest, el PC no es `localhost` sino `192.168.200.6`, así que hace falta
HTTPS. Sin él, el botón VR no aparece.

### Cómo se verificó
- `npm run quest` arranca y responde en `https://192.168.200.6:5173/` (código
  200); el modelo `.glb` (18,9 MB) se descarga completo por HTTPS.
- `http://` (sin s) en ese puerto no responde: solo hay HTTPS en este modo.
- El navegador de pruebas rechaza el certificado con `ERR_CERT_AUTHORITY_INVALID`:
  es lo esperado con un certificado autofirmado.
- ✅ **Prueba de Ozni en el Quest 3:** abrió `https://192.168.200.6:5173`,
  entró en VR y confirmó que "funciona bien y todo bien".

### Conceptos que aparecen
- **Contexto seguro (*secure context*).** Funciones sensibles del navegador
  (WebXR, cámara, micrófono) solo se activan en HTTPS o `localhost`.
- **Certificado TLS.** Prueba que un sitio es quien dice ser. Los de verdad los
  firma una autoridad (p. ej. Let's Encrypt); uno **autofirmado** cifra igual,
  pero el navegador no puede verificar quién lo emitió y avisa.
- **IP local y red privada.** `192.168.x.x` son direcciones dentro de tu casa;
  no se ven desde internet.
- **Modo de Vite (`--mode`).** Una misma configuración que cambia según el modo.
- **Cortafuegos (firewall).** Windows puede preguntar si Node.js puede recibir
  conexiones; hay que permitirlo solo en redes **privadas**.

### Para el tutor
- Ejercicio: explicar por qué `npm run dev` no necesita HTTPS en el PC y el
  Quest sí lo necesita.
- Pregunta: ¿por qué es aceptable saltarse el aviso del certificado aquí y
  nunca en una web desconocida?

### Pendientes
- Siguiente: módulo 0.4 (dividir `app.js` en módulos).

---

## 2026-11-08 — Módulo 0.2: Node.js y Vite

**Tipo:** herramientas de desarrollo. **La escena no cambió.**
**Archivos nuevos:** `package.json`, `package-lock.json`, `vite.config.js`.
**Modificados:** `README.md`, `CLAUDE.md`, `docs/PLAN_MAESTRO.md`.

### Qué cambió
- **Antes:** para ver la escena había que levantar el servidor de Python
  (`python -m http.server 8765`) y recargar el navegador a mano.
- **Ahora:** tres órdenes de npm:
  | Orden | Qué hace |
  |---|---|
  | `npm run dev` | Servidor en `http://localhost:5173`; al guardar un archivo, el navegador se recarga solo |
  | `npm run build` | Genera la versión publicable en la carpeta `dist/` (ignorada por Git) |
  | `npm run preview` | Sirve `dist/` en `http://localhost:4173` para probarla antes de publicar |
- **`package.json`:** la "ficha" del proyecto: nombre, órdenes (`scripts`) y
  dependencias. Vite es una **dependencia de desarrollo** (`devDependencies`):
  solo se usa para trabajar, no viaja a la web del visitante.
- **`package-lock.json`:** anota la versión exacta de cada paquete instalado,
  para que `npm install` instale lo mismo en cualquier PC. Se sube a Git.
- **`node_modules/`:** donde npm descarga los paquetes. **No** se sube a Git
  (ya estaba en `.gitignore`); se recrea con `npm install`.
- **`vite.config.js`:**
  - `base: './'`: rutas relativas, para que funcione igual en local y en
    GitHub Pages (que sirve la web desde `/arteanc-vr-demo/`).
  - `publicDir: false`: todavía no hay carpeta `public/`.
  - Un **plugin** propio, `copiar-archivos-clasicos`: al terminar el build copia
    `app.js`, `catalogo.js` y `modelos/` a `dist/`. Hace falta porque esos
    scripts se cargan con `<script src>` sin `type="module"`, y Vite solo
    empaqueta módulos. Desaparece en el módulo 0.4.

### Lo que **no** cambió
- `index.html`, `app.js`, `catalogo.js` y el modelo están intactos.
- GitHub Pages sigue publicando la raíz de `main` como antes. Publicar `dist/`
  será el módulo 0.6.

### Cómo se verificó (Playwright, Chrome)
1. `npm run dev`: la escena carga; el modelo `.glb` aparece; al hacer clic en
   las 3 piezas, la ficha muestra "CERAMICA 01", "MODELO 3D DE PRUEBA" y
   "FIGURA 03" con su precio. Captura igual a la de antes.
2. Recarga automática: se agregó una línea a `app.js` y el navegador se
   recargó solo (luego se quitó la línea).
3. `npm run build` + `npm run preview`: el modelo carga y la ficha funciona
   desde `dist/`.
4. Único error en la consola: falta `favicon.ico` (ya pasaba antes; sin efecto).
5. ✅ Ozni ejecutó `npm run dev` en su PC: funciona.

### Conceptos que aparecen
- **Node.js y npm.** Node ejecuta JavaScript fuera del navegador; npm instala
  paquetes (herramientas y librerías) escritos por otros.
- **Servidor de desarrollo.** Sirve los archivos por HTTP y vigila los cambios.
- **Bundler (empaquetador).** Junta y optimiza el código para publicarlo.
- **Script clásico frente a módulo ES.** `<script src>` comparte variables
  globales (`window.catalogoArteAnc`); `<script type="module">` usa
  `import`/`export`. Es el tema del módulo 0.4.
- **Versionado semántico.** En `"vite": "^8.3.6"`, el `^` permite
  actualizaciones menores (8.4, 8.5…) pero no la 9.

### Para el tutor
- Ejercicio: abrir `package.json` y explicar qué ocurre, paso a paso, al escribir `npm run dev`.
- Ejercicio: borrar la carpeta `node_modules/`, ejecutar `npm install` y
  explicar por qué el proyecto vuelve a funcionar igual.
- Pregunta: ¿por qué `dist/` y `node_modules/` no se suben a Git y `package-lock.json` sí?

### Primer intento de Ozni: error de PowerShell
Al escribir `npm run dev`, PowerShell respondió: *"No se puede cargar el
archivo `C:\Program Files\nodejs\npm.ps1` porque la ejecución de scripts está
deshabilitada en este sistema"*.
- **Causa:** la **directiva de ejecución** (*execution policy*) de Windows
  bloquea por defecto los scripts `.ps1`, y en PowerShell `npm` es un `.ps1`.
- **Solución:** `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`
  (una sola vez, solo para el usuario actual). Alternativa sin cambiar nada: `npm.cmd run dev`.
- **Concepto:** `RemoteSigned` deja ejecutar scripts creados en el PC y exige
  firma digital a los descargados de internet. Es una medida de seguridad,
  no un error del proyecto.
- Ejercicio: ejecutar `Get-ExecutionPolicy -List` y explicar cada ámbito (*scope*).

### Pendientes
- ✅ Ozni confirmó que `npm run dev` funciona en su PC (tras cambiar la directiva de ejecución).
- Siguiente: módulo 0.3 (abrir la escena en el Quest 3 desde el PC, con HTTPS).

---

## 2026-11-08 — Decisiones aprobadas: trabajo en `main` y fidelidad de las piezas

**Tipo:** solo documentación. **Archivos:** `docs/DECISIONES.md`, `CLAUDE.md`,
`docs/PLAN_MAESTRO.md`, `docs/ARQUITECTURA.md` y esta bitácora.

### Qué cambió
1. **DT-001 a DT-007 aprobadas por Ozni.** Pasan de "Propuesta" a "Aceptada".
2. **DT-011 (nueva): se trabaja directamente en `main`**, sin rama `fase-0`.
   El módulo 0.0 queda descartado. Regla compensatoria: antes de cada `push`
   la escena se prueba en local, porque `main` publica la web.
3. **DT-012 (nueva): la fidelidad visual de las piezas tiene prioridad.** Ozni
   señaló que las piezas son productos en venta y deben verse como las reales.
   - Antes: pieza ≤ 3 MB (estrella ≤ 6 MB), textura 2048 px, examen 30–60 mil triángulos.
   - Después: **galería** ≤ 3 MB y 2048 px (sin cambios); **examen** ≤ ~10 MB,
     hasta 4096 px y 30–100 mil triángulos, cargada solo al examinar la pieza.
   - Cada pieza se acepta comparándola en el Quest con fotos de la real.

### Conceptos que aparecen
- **Rama de Git.** Una línea de trabajo paralela. Se decidió no usarla todavía
  para simplificar; `git revert` deshace un commit subido por error.
- **Carga bajo demanda.** Descargar algo solo cuando se necesita. Permite una
  versión muy detallada sin hacer lenta la entrada a la casa.
- **Nivel de detalle (LOD).** Lo lejano se dibuja simple; lo cercano, detallado.
- **Mapa de normales.** Una textura que "finge" relieve: guarda el detalle del
  escaneo denso sobre una malla con menos triángulos.

### Para el tutor
- Ejercicio: explicar por qué 20 piezas de 10 MB en la sala serían un problema
  y una sola pieza de 10 MB en la mano no lo es.
- Ejercicio de Git: ¿qué hace `git revert` y en qué se diferencia de borrar un commit?

### Pendientes
- Hacer una copia de seguridad externa de `_fuentes-3d/` (DT-007).
- Siguiente: módulo 0.2 (Node + Vite).

---

## 2026-11-08 — Diseño final incorporado y proyecto organizado

**Tipo:** organización y documentación (no se cambió el código de la escena).

### Qué se hizo
1. **Revisión del diseño final** entregado por ChatGPT ("La Casa ArteAnc" con el
   Santuario precolombino). Claude comprobó `02-layout.json` con un script
   propio: salas sin solapes, 0,40 m de muro entre salas vecinas, accesos
   centrados y 38 posiciones de exhibición bien ubicadas. Se aceptó como
   referencia oficial (DT-009).
2. **Incorporación a `docs/diseno/final/`.** Las 8 perspectivas pasaron de PNG
   (~2,3 MB) a JPG (~230 KB). Detalles en [diseno/README.md](diseno/README.md).
3. **Referencias** ligeras de los prototipos 1 y 2 en `docs/diseno/referencias/`;
   los prompts de diseño, en `docs/diseno/encargos/`.
4. **Limpieza (módulo 0.1 de la Fase 0).**
   - `_archivo/`: entregas originales (ZIP, borradores de ChatGPT y SVG editables
     pesados) y `index - copia.html`.
   - `_fuentes-3d/escaneos-pruebas/`: los 23 archivos de escaneos de prueba que
     no usa la escena.
   - Ambas carpetas son **locales e ignoradas por Git**. No se borró nada.
5. **Documentos actualizados:** `PLAN_MAESTRO.md` (el *greybox* se adelanta
   a la Fase 1), `ARQUITECTURA.md` (contrato de datos y presupuesto
   unificados), `VISION.md`, `DECISIONES.md` (DT-009 y DT-010),
   `MAPA_ESCENA.md` y los README.
6. **`CLAUDE.md` nuevo en la raíz:** instrucciones que Claude Code lee
   automáticamente al empezar cada sesión (estado, siguiente paso y reglas de
   documentación).

### Conceptos que aparecen
- **Fuente de verdad única.** Un solo archivo (`02-layout.json`) define las
  medidas; las imágenes, el plano y el código derivan de él.
- **Compresión con pérdida (JPG) frente a sin pérdida (PNG).** Para fotos y
  renders, JPG ocupa 10 veces menos con una diferencia casi invisible; para
  diagramas con texto (planta, fichas) conviene PNG o SVG.
- **`.gitignore`.** Le dice a Git qué carpetas no debe subir nunca.
- **`CLAUDE.md`.** Memoria del proyecto para el asistente: evita repetir el contexto en cada sesión.

### Para el tutor
- Ejercicio: abrir `docs/diseno/final/02-layout.json`, buscar el slot `S09` y
  ubicarlo en `01-planta.png`. ¿Por qué su `y` vale 1 y la de `C02` vale 0,9?
  (Pista: peana frente a vitrina.)

### Pendientes
- Confirmar el estado de las decisiones DT-001 a DT-007 (siguen como "Propuesta").
- Siguiente sesión: Fase 0, desde el módulo 0.2 (Node + Vite).
- Actualización: Ozni decidió trabajar en `main` sin rama `fase-0` (DT-011);
  el módulo 0.0 queda descartado.

---

## 2026-11-07 — Comparación de prototipos y encargo del diseño final

**Tipo:** solo documentación. **Archivos:** `docs/diseno/PROMPT_DISENO_FINAL.md`
(nuevo) y `docs/DECISIONES.md` (DT-008).

Se compararon las dos propuestas de ChatGPT, llamadas **Prototipo 1**
(Santuario) y **Prototipo 2** (La Casa). Se decidió combinarlas: la Casa como
edificio y el Santuario como sala principal precolombina en el eje norte. Se
escribió el encargo de un diseño final congelado con planta, coordenadas y
posiciones de exhibición en `layout.json`.

### Conceptos que aparecen
- **Congelar un diseño.** Fijar una versión de referencia para que todos
  construyan sobre lo mismo; los cambios posteriores se registran como versiones nuevas.
- **Eje y remate.** En arquitectura, un eje que guía la mirada hacia un punto
  final importante (aquí, el portal del Santuario).
- **Jerarquía espacial.** Una sola sala con tratamiento especial se percibe
  más valiosa que si todas fueran iguales.
- **Sistema de coordenadas acordado.** Origen en la entrada, norte = −Z: así la
  planta y el código hablan el mismo idioma.

---

## 2026-11-07 — Encargo de diseño visual de "La Casa ArteAnc"

**Tipo:** solo documentación. **Archivo nuevo:** `docs/diseno/PROMPT_CASA_ARTEANC.md`.

Se escribió un prompt para que una IA de imágenes (ChatGPT u otra) genere el
diseño visual objetivo: guía de estilo, planta, vista isométrica, vistas de
cada espacio, interfaz en VR y el kit arquitectónico modular. El prompt fija
medidas y restricciones técnicas para que todas las imágenes muestren el mismo
edificio y este se pueda construir en el Quest 3.

### Conceptos que aparecen
- **Concept art frente a especificación.** Una imagen inspira; las medidas y
  los presupuestos de rendimiento son lo que se construye.
- **Kit modular.** Diseñar piezas arquitectónicas repetibles (muro, puerta,
  hornacina) en lugar de un edificio único: menos trabajo y mejor rendimiento.
- **Prompting con restricciones.** Darle a una IA medidas, paleta y límites
  produce resultados coherentes y utilizables.

---

## 2026-11-07 — Diagnóstico, visión y plan maestro

**Tipo:** solo documentación (no se cambió código).
**Archivos nuevos:** `docs/README.md`, `docs/DIAGNOSTICO.md`, `docs/VISION.md`,
`docs/ARQUITECTURA.md`, `docs/PLAN_MAESTRO.md`, `docs/DECISIONES.md`.

### Qué se hizo
Se revisó el proyecto completo y se escribió la base de la planificación:
- **Diagnóstico:** el prototipo funciona, pero todo está escrito a mano en un
  solo HTML, los modelos pesan demasiado (19 MB) y la experiencia en VR carece
  de confort (sin teletransporte) y de la función clave: examinar las piezas.
- **Visión:** "La Casa ArteAnc", una casa andina con patio central y salas
  temáticas alrededor, mesa de examen y compra en arteanc.com.
- **Arquitectura:** se recomienda **seguir con A-Frame** y reorganizar el
  proyecto para que la escena se construya a partir de datos JSON.
- **Plan:** 8 fases (F0–F7) hasta la v1.0, mejoras posteriores y experimentos.
- **Decisiones:** 7 decisiones registradas como "Propuesta", pendientes de aprobación.

### Conceptos que aparecen
1. **Separar datos y presentación.** Es el cambio más importante del plan: el
   *qué* (catálogo) va separado del *cómo se muestra* (componentes).
2. **Patrón entidad-componente (ECS).** Es la base de A-Frame. Una entidad es un
   contenedor; los componentes le dan comportamiento.
3. **Presupuesto de rendimiento.** En VR se planifica con límites medibles
   (fps, triángulos, MB), no "a ojo".
4. **Iluminación horneada.** Calcular la luz una vez y guardarla en texturas, en
   lugar de calcularla en cada fotograma.
5. **Registro de decisiones (ADR).** Anotar por qué se decide algo, no solo qué.
6. **Fotogrametría → web.** Un escaneo crudo no está listo para publicarse:
   necesita limpieza y compresión.

### Para el tutor
- Buen momento para repasar el vocabulario: WebXR, Three.js, glTF/GLB,
  *draw call*, fps, *bundler*, JSON, componente.
- Ejercicio sugerido: leer `VISION.md` y `PLAN_MAESTRO.md`, y explicar con
  palabras propias por qué la Fase 0 no cambia nada visible y aun así va primero.

### Pendientes
- Aprobar o ajustar las decisiones DT-001 a DT-007.
- Responder las "Preguntas abiertas para ArteAnc" de `PLAN_MAESTRO.md`.

---

## 2026-11-07 — Panel de bienvenida integrado en la recepción

**Archivos:** `index.html` (bloque `#bienvenidaRecepcion`), `docs/MAPA_ESCENA.md` (nuevo),
`.gitignore`.

### Problema
Al hacer clic en el mostrador aparecía un panel de 2.8 × 1.25 m flotando a 2 m
de altura, delante del mostrador (`position="-3.7 2 0.82"`). Tenía el mismo
tamaño que la ficha de productos y se interponía en la vista de quien entraba
por la puerta.

### Antes y después
| | Antes | Después |
|---|---|---|
| Posición | `-3.7 2 0.82` | `-3.7 1.5 1.55` |
| Rotación | ninguna (mira hacia +z, la entrada) | `0 180 0` (mira hacia −z, la galería) |
| Tamaño del fondo | 2.8 × 1.25 | 1.3 × 0.5 |
| Marco | no | `a-box` de madera de 1.4 × 0.6, color `#A98158` (el mismo de la superficie del mostrador) |
| Textos | alineados a la izquierda (`x = -1.25`) | centrados (`align="center"`, `x = 0`) |

Ahora es un letrero de mesa apoyado al fondo de la superficie del mostrador. El
`id`, el `visible="false"` inicial y el código de `app.js` que lo muestra y
oculta **no cambiaron**.

### Conceptos que aparecen
1. **Coordenadas en A-Frame.** x = izquierda/derecha, y = altura, z = profundidad.
   La cámara empieza mirando hacia −z.
2. **Cara frontal de `a-plane` y `a-text`.** Por defecto solo se dibujan por un
   lado, el que mira hacia +z. Visto desde atrás, el objeto no aparece. Por eso
   se usa `rotation="0 180 0"` para que el letrero mire hacia la galería.
3. **Posición local (jerarquía).** Los hijos de un `a-entity` se colocan
   *relativos* a su padre. El texto en `0 0.14 0.01` está 14 cm arriba y 1 cm
   delante del centro del letrero, aunque el letrero esté girado.
4. **Apoyar un objeto sobre otro.** La superficie del mostrador está en
   y = 1.14 y mide 0.16 de alto, así que su cara superior está en
   1.14 + 0.08 = 1.22. El letrero mide 0.5 (0.6 con el marco), así que su centro
   va en ≈ 1.5 para que la base quede justo encima.
5. **Raycaster y `.interactivo`.** El cursor y los láseres solo detectan objetos
   con la clase `interactivo`. El letrero no la tiene, así que no bloquea el
   clic sobre el mostrador.
6. **Evitar el z-fighting.** El texto está en z = 0.01 y el marco en z = −0.025.
   Esa separación evita que dos superficies en el mismo plano parpadeen.

### Cómo se verificó
Se sirvió el proyecto en `http://127.0.0.1:8765` y se abrió con Playwright (Chrome):
- Desde la galería, el letrero aparece sobre el mostrador y se lee bien.
- El segundo clic en el mostrador lo oculta.
- La ficha de productos, el modelo 3D (`#pieza02`) y la vista inicial funcionan
  igual que antes.
- El modo VR del Quest 3 **no** se probó; queda pendiente de probar en el visor.

### Sugerencias de ejercicio
- Cambia `rotation="0 180 0"` por `0 0 0`, recarga y míralo desde la galería y
  desde la entrada. ¿Por qué desaparece desde un lado?
- Mueve el letrero a `z = 1.0` (el borde delantero del mostrador). ¿Queda mejor
  o peor? ¿Qué pasa si lo bajas a `y = 1.3`?

### Pendientes detectados (no corregidos)
- El texto "ARTEANC" del frente del mostrador (`-3.7 0.75 0.91`) mira hacia +z,
  así que desde la galería no se ve. Se confirmó en la captura. La solución
  probable es `rotation="0 180 0"`; es un buen ejercicio con el concepto 2.
- En PC, WASD mueve la cámara sin límites y se pueden atravesar paredes. El
  límite solo existe en VR (`caminar-quest` en `app.js`).
