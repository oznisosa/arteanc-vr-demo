# Bitácora de cambios — ArteAnc VR

> **Nota para ChatGPT (tutor):** este archivo lo escribe Claude Code cada vez que
> modifica el proyecto junto con Ozni. Cada entrada explica qué cambió, por qué
> y qué conceptos aparecen, para que puedas usarla como material de enseñanza.
> El mapa de coordenadas de la escena está en `docs/MAPA_ESCENA.md`.
> Las entradas más recientes van primero.

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
