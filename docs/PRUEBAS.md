# Lista de pruebas — ArteAnc VR

Comprobaciones manuales para saber que **nada se rompió** antes de publicar.
Como cada `git push` a `main` publica la web (DT-011 y DT-013), estas pruebas
son la red de seguridad del proyecto.

Hay dos niveles:
- **Prueba rápida** (≈ 3 min): antes de **cada** push.
- **Prueba completa** (≈ 15 min): al terminar un módulo que cambie la escena,
  los controles o la publicación, y siempre antes de cerrar una fase.

Cuando una prueba falle, anotarlo en la [bitácora](BITACORA.md) con qué se
hizo, qué se esperaba y qué pasó.

> Esta lista crece con el proyecto: cada módulo que añada algo visible añade
> aquí su comprobación. Última actualización: **2026-11-08** (fin de la Fase 0).

---

## 1. Prueba rápida (antes de cada push)

En PowerShell, en la carpeta del proyecto:

| # | Paso | Resultado esperado | ✓ |
|---|---|---|---|
| R1 | `npm run build` | Primero `✓ datos/catalogo.json: N piezas correctas` y `✓ datos/salas.json: al día con el diseño…`, luego `✓ built in …`, sin errores en rojo | |
| R2 | `npm run dev` | Se abre el navegador con la sala | |
| R3 | Clic en las 3 piezas | La ficha aparece **junto a cada pieza** con su chip, nombre y precio | |
| R4 | Clic en **CERRAR** | La ficha desaparece | |
| R5 | Clic en el botón de la puerta | Las puertas se abren; el letrero cambia a CERRAR | |
| R6 | Abrir la consola del navegador (F12 → Console) | Ningún error en rojo, salvo `favicon.ico` (conocido) | |

Si todo está bien: `Ctrl + C` para cerrar el servidor y hacer `git push`.

---

## 2. Prueba completa

### 2.1 PC (Chrome o Edge) — `npm run dev`

| # | Qué probar | Resultado esperado | ✓ |
|---|---|---|---|
| P1 | Cargar la página | La sala aparece en menos de 10 s; el modelo 3D aparece sobre el pedestal central | |
| P2 | Piezas sobre las peanas | El modelo, la esfera y el cono apoyados sobre su peana, sin flotar ni hundirse; el modelo mide ~65 cm | |
| P2b | Clic en una peana (no en la pieza) | No abre la ficha | |
| P3 | Suelo | Baldosas de piedra en 4 tonos (24 en total) | |
| P4 | Ficha: clic en la esfera, el modelo y el cono | Aparece a la derecha de la pieza, sin taparla. Esfera: chip "ARTESANIA TRADICIONAL PERUANA", "CERAMICA 01", "Precio ficticio: US$ 35.00". Modelo: chip "ORIGINAL DOCUMENTADO", "No disponible para venta" y "Historia y fuentes: Sin fuentes verificadas". Cono: "FIGURA 03", "Precio ficticio: US$ 45.00". En las tres: "Clasificacion ilustrativa (demo)" | |
| P4b | Ficha: clic en otra pieza con la ficha abierta | La ficha se mueve junto a la nueva pieza (solo hay una abierta) | |
| P4d | Ficha: abrirla **desde detrás** o desde un lado de la pieza | Se ve de frente, derecha y a tu derecha de la pieza | |
| P4e | Ficha: con la ficha abierta, caminar alrededor de la pieza | La ficha te sigue suavemente sin separarse de la pieza | |
| P4c | Ficha: legibilidad | Ningún texto se superpone ni se sale del panel | |
| P5 | Ficha: CERRAR | Se oculta | |
| P6 | Puertas: botón interior | Se abren las dos hojas; letreros "CERRAR" | |
| P7 | Puertas: botón exterior | Se cierran; letreros "ABRIR" (los dos botones controlan la misma puerta) | |
| P8 | Recepción: clic en el mostrador | Aparece el letrero de bienvenida; otro clic lo oculta | |
| P9 | Moverse con W A S D y mirar con el ratón | Funciona (en PC se atraviesan paredes: conocido, Fase 2) | |
| P10 | Añadir `?debug` a la dirección | Panel de A-Frame arriba a la izquierda y panel verde con fps, llamadas y triángulos | |
| P11 | Quitar `?debug` | No aparece ningún panel | |
| P12 | `npm run build` y `npm run preview` → `http://localhost:4173` | Repetir P1, P4 y P6: igual que en `npm run dev` | |

### 2.2 Meta Quest 3 — `npm run quest`

En el PC: `npm run quest`. En el navegador del Quest:
`https://192.168.200.6:5173/?debug` (aceptar el aviso del certificado).

| # | Qué probar | Resultado esperado | ✓ |
|---|---|---|---|
| Q1 | Botón **VR** | Entra en modo inmersivo; la sala a escala real | |
| Q2 | Altura de la vista | Natural, como estar de pie en la sala | |
| Q3 | Láser del mando derecho sobre una pieza + gatillo | Aparece la ficha correcta | |
| Q4 | Láser sobre CERRAR + gatillo | La ficha se oculta | |
| Q5 | Láser sobre el botón de la puerta + gatillo | Las puertas se abren y se cierran | |
| Q6 | Láser sobre el mostrador + gatillo | Aparece/desaparece la bienvenida | |
| Q7 | **Joystick izquierdo adelante** | Avanzas hacia donde miras | |
| Q8 | Joystick atrás | Retrocedes | |
| Q9 | Joystick derecha / izquierda | Te desplazas a la derecha / izquierda | |
| Q10 | Girar la cabeza 90° y repetir Q7 | Avanzas hacia la **nueva** dirección de la mirada | |
| Q11 | Caminar hacia una pared con el joystick | Te detienes antes de atravesarla | |
| Q12 | Panel verde (`?debug`) dentro de VR | Visible abajo a la izquierda; anotar los números (sección 4) | |
| Q13 | Mareo o tirones | Movimiento fluido; fps cerca de 72 | |

### 2.2b La Casa (greybox) — `casa.html`

| # | Qué probar | Resultado esperado | ✓ |
|---|---|---|---|
| C1 | Abrir `casa.html?debug` | Aparece la Recepción con el mostrador; medidor ≈ 25 llamadas y ≈ 4 000 triángulos | |
| C2 | Caminar hacia el norte | Galería sur → patio con el canal de agua y la peana P01 | |
| C3 | Accesos | Huecos trapezoidales (más estrechos arriba), sin puertas | |
| C4 | Salas laterales del patio | Cerámica (oeste) y Textiles (este), 8 posiciones cada una; al entrar desde el patio, el nombre de la sala se ve de frente | |
| C5 | Portal del Santuario | Bloque de 6,5 m con túnel de 1,2 m; al fondo, 3 peanas negras en el eje | |
| C6 | Santuario | Techo a 6,5 m con ranura abierta al cielo; 6 hornacinas laterales con fondo bronce | |
| C7 | Escala (en el Quest) | Las salas, peanas (1 m) y puertas (2,6 m) se sienten de tamaño real | |
| C8 | `index.html` | Sigue igual que antes | |

### 2.3 Web publicada

Después del push, en https://github.com/oznisosa/arteanc-vr-demo/actions:

| # | Qué probar | Resultado esperado | ✓ |
|---|---|---|---|
| W1 | "Publicar en GitHub Pages" | ✅ verde en 1–2 minutos | |
| W2 | Abrir https://oznisosa.github.io/arteanc-vr-demo/ | Igual que en local (repetir P1, P4, P6) | |
| W3 | Abrirla en el Quest (sin servidor local) | Entra en VR y funciona (repetir Q1, Q3, Q7) | |

---

## 3. Problemas conocidos (no son fallos de la prueba)

| Problema | Se resolverá en |
|---|---|
| Falta `favicon.ico` (error 404 en la consola) | 1.5 o cuando haya logo |
| Textos sin tildes ni eñes ("CERAMICA") | 1.5 (fuente MSDF) |
| El letrero "ARTEANC" del mostrador mira al revés | 1.5 |
| En PC se atraviesan las paredes | 2.3 |
| El modelo pesa 19 MB y tarda en cargar | 3.3 |
| Movimiento continuo (puede marear a algunas personas) | 2.1 y 2.2 |

---

## 4. Valores de referencia (medidor `?debug`, vista inicial)

| Dónde | fps | Llamadas | Triángulos | Fecha |
|---|---|---|---|---|
| PC de pruebas (Playwright) | 60 | 34 | 104 015 | 2026-11-08 |
| PC de Ozni (ventana ancha) | 59 | 38 | 104 023 | 2026-11-08 |
| Quest 3, fuera de VR | | | | pendiente |
| Quest 3, dentro de VR (`index.html`) | | | | pendiente |
| Quest 3, dentro de VR (`casa.html`, greybox) | **90** | ≈ 25 (PC) | ≈ 4 000 (PC) | 2026-11-08 |

Presupuesto ([ARQUITECTURA.md](ARQUITECTURA.md) §5): 72 fps en el Quest ·
menos de 100 llamadas · menos de 250 000 triángulos. Si un cambio sube mucho
estas cifras sin motivo, investigar antes de publicar.

---

## 5. Prueba automática de equivalencia (la ejecuta Claude)

Durante la Fase 0, Claude comprueba con Playwright que la escena local y la
publicada dan los mismos valores: modelo con dimensión mayor 0,650 m y base
en y = 1,000 (1,020 antes del módulo 1.2); esfera y cono con base en 1,000; 24 baldosas; las 3 fichas; puertas; recepción; y el joystick
simulado en las cuatro direcciones. Sirve para detectar cambios que a simple
vista pasarían desapercibidos.
