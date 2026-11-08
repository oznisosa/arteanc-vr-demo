# Mapa de la escena — ArteAnc VR

> Este mapa describe el **prototipo actual** (una sala, `index.html`). La casa
> definitiva tiene **otro sistema de coordenadas**, con el origen en el umbral
> sur y el norte en −Z, y está en
> [diseno/final/02-layout.json](diseno/final/02-layout.json). Cuando se
> construya el *greybox* (Fase 1), este documento se actualizará.

Referencia de los elementos de `index.html`, sus coordenadas y las partes del
código que dependen de ellos.

## Sistema de coordenadas

A-Frame usa metros y la regla de la mano derecha:

- **x**: negativo = izquierda, positivo = derecha (vista desde la posición inicial).
- **y**: altura. El suelo está en `y = 0`.
- **z**: negativo = hacia el fondo de la galería; positivo = hacia la entrada.

La cámara empieza mirando hacia **−z** (hacia la pared del fondo).
`a-plane` y `a-text` solo se ven por su cara frontal, que por defecto mira hacia **+z**.
Con `rotation="0 180 0"` pasan a mirar hacia **−z**.

## Vista en planta (aproximada)

```
 z = -6   ┌──────────── PARED FONDO + 3 paneles (z -5.78) ────────────┐
          │                                                            │
 z = -3.5 │        (P1)            (P2)            (P3)    pedestales  │
 z = -3.05│      [ficha a la derecha de la pieza elegida, y 1.45]     │
 z = -2.82│                   placa monumento                          │
          │                                                            │
 z =  0   │                     ● cámara (0, 1.6, 0)                   │
 z =  1.3 │ [MOSTRADOR -3.7]                                           │
          │  └ letrero bienvenida (z 1.55)                             │
 z =  2.74│              ║puerta izq║puerta der║                       │
 z =  2.9 └──pared─────[btn -2.45]───ENTRADA───────────pared───────────┘
        x = -6                         x = 0                         x = 6
```

## Estructura

| Elemento | Posición | Dimensiones | Notas |
|---|---|---|---|
| Suelo (`a-plane`) | `0 0 -3` | 12 × 12 | Cubre x −6..6, z −9..3 |
| Baldosas (`#baldosas`) | x −5..5, z −5..1 (paso 2) | 1.96 × 1.96, y 0.012 | Las genera `src/escena/suelo.js` (4 filas × 6 columnas) |
| Pared del fondo | `0 2 -6` | 12 × 4 × 0.2 | Texto "ARTEANC" en `0 3 -5.85` |
| Pared izquierda | `-5.95 2 -1.5` | 0.1 × 4 × 9 | z −6..3 |
| Pared derecha | `5.95 2 -1.5` | 0.1 × 4 × 9 | z −6..3 |
| Techo | `0 4.05 -1.5` | 12 × 0.12 × 9 | |
| Pared frontal izq. | `-4 2 2.9` | 4 × 4 × 0.16 | x −6..−2 |
| Pared frontal der. | `4 2 2.9` | 4 × 4 × 0.16 | x 2..6 |
| Dintel de la entrada | `0 3.5 2.9` | 4 × 1 × 0.16 | Hueco de la entrada: x −2..2, y 0..3 |

## Iluminación

| Luz | Posición | Notas |
|---|---|---|
| Ambiental | — | intensidad 0.8 |
| Direccional | `-2 5 3` | intensidad 1.2 |
| Puntual cálida | `0 2.8 -2.6` | `#FFF0D9`, alcance 5 m, ilumina el pedestal central |

## Paneles de exhibición (pared del fondo)

Cada panel tiene un marco (`a-box` de 1.75 × 1.9 × 0.05, en z −5.78) y un fondo oscuro (`a-plane` de 1.65 × 1.8, en z −5.72).

| Panel | x | y |
|---|---|---|
| Izquierdo | −2 | 1.85 |
| Central | 0 | 1.85 |
| Derecho | 2 | 1.85 |

## Pedestales y productos

Desde el módulo 1.2 cada pieza es **una sola entidad** con el componente
`pieza-exhibida` (`src/componentes/pieza-exhibida.js`). Su `position` es el
punto del **suelo** en el centro de la peana. El componente crea dentro:
- la **peana** (`.peana`): cilindro de 1,3 m de diámetro y 1 m de alto, cara superior en **y = 1.0**;
- la **pieza** (`.interactivo`): el modelo de `modelos.galeria` del catálogo o
  una forma provisional, con su base en y = 1.0.

| Pieza | id (entidad = catálogo) | Posición (suelo) | Lo que se ve |
|---|---|---|---|
| Pieza 1 | `#pieza01` | `-2 0 -3.5` | Esfera provisional Ø 0.70 (centro y 1.35), `#C07746` |
| Pieza 2 | `#pieza02` | `0 0 -3.5` | Modelo `modelos/Untitle123d.glb` (desde el catálogo), dimensión mayor 0.65 m (`tamanoSinMedidas`), base en y 1.000 |
| Pieza 3 | `#pieza03` | `2 0 -3.5` | Cono provisional h 0.70 (centro y 1.35), `#8A6650` |

Antes del 1.2: 3 `<a-cylinder>` sueltos, `<a-sphere>`, `<a-cone>` y un
`<a-entity gltf-model>` con la base del modelo en y 1.02.
| Placa del monumento | — | `0 0.68 -2.82` | 1 × 0.25, texto "MONUMENTO HISTORICO" |

Los tres productos tienen las clases `producto` e `interactivo`.

## Ficha de producto (`#ficha`)

Desde el módulo 1.3: `<a-entity id="ficha" ficha-producto>` (componente en
`src/componentes/ficha-producto.js`). Empieza oculta.
- **Posición: variable, según dónde esté el visitante.** Aparece **0,85 m a la
  derecha de la pieza tal como la ve el visitante**, **0,45 m desde la pieza
  hacia él**, con el centro a **y = 1,45**, mirándole de frente y siempre
  vertical (solo gira en Y). Mientras está abierta **sigue al visitante
  suavemente** si camina alrededor de la pieza (opción `suavidad`, 6 por defecto).
  Ejemplo desde la posición inicial (0, 1,6, 0): pieza02 → aprox. `0.88 1.45 -3.1`.
- Fondo marfil `#FFF4E6` de **0,95 m** de ancho y **0,62 m** de alto mínimo (crece con el texto).
- Contenido: chip del tipo de pieza (color según el tipo), aviso "Clasificación
  ilustrativa (demo)", título, precio, disponibilidad, detalles conocidos y descripción.
- Botón `#cerrarFicha` abajo a la derecha (0,26 × 0,09); tiene la clase
  `interactivo` solo mientras la ficha está visible.
- Antes del 1.3: panel fijo en `0 2.35 -3.05` de 2,8 × 1,45 con `#nombre`, `#precio` y `#descripcion`.

## Recepción

| Elemento | id | Posición | Dimensiones | Notas |
|---|---|---|---|---|
| Cuerpo del mostrador | `#mostradorRecepcion` | `-3.7 0.55 1.3` | 2 × 1.1 × 0.75 | Clase `interactivo`. Un clic muestra u oculta la bienvenida |
| Superficie superior | — | `-3.7 1.14 1.3` | 2.2 × 0.16 × 0.9 | Ocupa y 1.06..1.22 y z 0.85..1.75 |
| Letrero "ARTEANC" | — | `-3.7 0.75 0.91` | width 2.5 | Ver "Observaciones" |
| Letrero de bienvenida | `#bienvenidaRecepcion` | `-3.7 1.5 1.55`, rot `0 180 0` | marco 1.4 × 0.6, fondo 1.3 × 0.5 | Se apoya al fondo de la superficie y mira hacia la galería. Empieza oculto |

El letrero de bienvenida no es `interactivo`, así que no intercepta los clics del raycaster.

## Entrada y puertas

| Elemento | id | Posición | Notas |
|---|---|---|---|
| Puerta izquierda | `#puertaIzquierda` | cerrada `-1 1.45 2.74`, abierta `-3 1.45 2.74` | 1.92 × 2.9 × 0.08. Animaciones `abrir` y `cerrar` (750 ms) |
| Puerta derecha | `#puertaDerecha` | cerrada `1 1.45 2.74`, abierta `3 1.45 2.74` | Igual que la izquierda |
| Botón interior | `#botonPuerta` | `-2.45 1.45 2.65` | `interactivo`. Su texto `#textoPuerta` está girado 180° |
| Botón exterior | `#botonPuertaExterior` | `-2.45 1.45 3.07` | `interactivo`. Su texto `#textoPuertaExterior` está en z 3.125 |

## Jugador y controles

| Elemento | id | Posición | Notas |
|---|---|---|---|
| Rig | `#jugador` | `0 0 0` | Componentes `zonas-transitables`, `caminar-quest`, `teletransporte`, `giro-por-pasos` y `modo-sentado`. El giro cambia su `rotation.y` (y su posición, para girar sobre la cabeza). El modo sentado cambia su `position.y` (0 de pie; la subida calibrada sentado) |
| Cámara | `#camara` | `0 1.6 0` (local) | Cursor `rayOrigin: mouse` para clics en PC. En PC se mueve con WASD sin límites |
| Mando izquierdo | `#mando-izquierdo` | — | `laser-controls`. El joystick camina (`caminar-quest`); botón Y = modo sentado (módulo 2.4) |
| Mando derecho | `#mando-derecho` | — | `laser-controls`. Gatillo = seleccionar; joystick adelante = teletransporte (módulo 2.1); a los lados = giro de 30° (módulo 2.2). DT-031 |
| Mano izquierda / derecha | `#mano-izquierda`, `#mano-derecha` | — (las pone el visor) | `hand-tracking-controls` + `mano-puntero` (módulo 2.5): rayo hombro→mano; pellizco = clic o arco de salto |

Los tres raycasters filtran por `.interactivo` (los mandos con `far: 10`).
Los rayos de las manos (`mano-puntero`) también, con 4 m de alcance.

**Fuera de VR (módulo 2.6):** `clic-en-suelo` en el `#jugador`. Clic (PC) o
toque (móvil) en el suelo → salto con fundido, si el primer objeto que toca
el rayo desde la cámara es el suelo (y < 0,08 m) y el punto es pisable. Los
objetos de ayuda (arco, anillo, fundido, rayos de las manos, mapa `?zonas`)
llevan `userData.ayuda = true` y se ignoran.

`caminar-quest` solo actúa en modo VR, a 1.2 m/s.

**Zonas transitables (módulo 2.3, DT-032):** el `#jugador` lleva
`zonas-transitables="suelos: -5.9 5.9 -5.9 2.82; alto: 4; obstaculos: .peana, #mostradorRecepcion"`.
- Suelo: el interior de los muros (x −5.9..5.9, z −5.9..2.82), techo a 4 m.
- Obstáculos medidos al cargar: las 3 peanas (círculos de radio 0.65 en
  x −2, 0, 2; z −3.5) y el mostrador (2 × 0.75 en −3.7, 1.3).
- La cabeza se mantiene a 0.25 m (radio del cuerpo) de muros y obstáculos.
- Si se cambia una pieza de sitio, su peana se mide sola en la nueva posición.
- `?zonas` en la dirección dibuja el mapa en el suelo.

`teletransporte` (`src/componentes/teletransporte.js`) usa ese mapa: el arco
se corta al tocar muro, techo o mueble, y solo vale caer en suelo pisable.
El arco, el anillo y la esfera del fundido son objetos de THREE.js creados
por código: no aparecen en `index.html`. El arco y el anillo se añaden a la
escena y solo se ven al apuntar; la esfera del fundido es hija de `#camara`.

## Dependencias

- **A-Frame 1.8.0** desde el CDN `https://aframe.io/releases/1.8.0/aframe.min.js`. Sin conexión la escena no carga.
- **Código**: un solo `<script type="module" src="./src/main.js">` al final del `<body>`. `main.js` importa los demás módulos de `src/` (desde el módulo 0.4; antes eran `catalogo.js` y `app.js`).
- **`datos/catalogo.json`** (desde el módulo 1.1; se descarga con `fetch`): cada pieza tiene un campo `id` (`pieza01`, `pieza02`, `pieza03`) que debe coincidir con el `id` de su entidad en `index.html`.
- **Los módulos de `src/`** necesitan que existan estos ids en `index.html`:
  `#ficha` (los demás elementos de la ficha los crea su componente),
  `#baldosas`, `#camara`, `#mando-izquierdo`, `#botonPuerta`,
  `#botonPuertaExterior`, `#textoPuerta`, `#textoPuertaExterior`,
  `#puertaIzquierda`, `#puertaDerecha`, `#mostradorRecepcion` y
  `#bienvenidaRecepcion`.
  Además usa `.producto` para los clics de producto. La clase `.interactivo` la usan los raycasters.
- **Modelos**: solo `modelos/Untitle123d.glb` se usa en la escena. Los demás `.glb` de `modelos/` no están referenciados.
- Para que el `.glb` cargue, la escena debe servirse por HTTP; con `file://` no funciona.

## Observaciones (sin corregir)

- ~~El texto "ARTEANC" del frente del mostrador miraba hacia el propio mostrador~~ **Corregido en el módulo 1.5**: `rotation="0 180 0"`, ahora mira a la galería.
- **Textos (desde el 1.5):** los textos fijos de la escena usan el componente `texto="clave: …"` y salen de `datos/textos/es.json`; la marca y los títulos usan Cormorant Garamond (`fuente: titulo`), el resto Inter.
- En PC, la cámara se mueve con WASD sin los límites de `caminar-quest`, así que se pueden atravesar las paredes.
- ~~Joystick invertido~~ **Corregido el 2026-11-08** (Ozni lo confirmó en el Quest): `getWorldDirection` devolvía el eje +z de la cámara, que apunta hacia atrás; ahora se invierte con `.negate()` en `src/componentes/caminar-quest.js`.
