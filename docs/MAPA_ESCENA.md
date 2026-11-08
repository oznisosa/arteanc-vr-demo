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
 z = -3.05│                    [ FICHA y 2.35 ]                        │
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
| Baldosas (`#baldosas`) | x −5..5, z −5..1 (paso 2) | 1.96 × 1.96, y 0.012 | Las genera `app.js` (4 filas × 6 columnas) |
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

Los pedestales son cilindros de radio 0.65 y altura 1, centrados en y 0.5, con la cara superior en **y = 1.0**.

| Producto | id | Posición | Geometría |
|---|---|---|---|
| Pedestal izq. | — | `-2 0.5 -3.5` | |
| Pedestal central | — | `0 0.5 -3.5` | |
| Pedestal der. | — | `2 0.5 -3.5` | |
| Producto 1 | `#pieza01` | `-2 1.35 -3.5` | Esfera r 0.35 |
| Producto 2 | `#pieza02` | `0 0 -3.5` | Modelo `modelos/Untitle123d.glb`. `app.js` lo escala a 0.65 m y apoya su base en y 1.02 |
| Producto 3 | `#pieza03` | `2 1.35 -3.5` | Cono h 0.7 |
| Placa del monumento | — | `0 0.68 -2.82` | 1 × 0.25, texto "MONUMENTO HISTORICO" |

Los tres productos tienen las clases `producto` e `interactivo`.

## Ficha de producto (`#ficha`)

- Posición `0 2.35 -3.05`, mira hacia +z (hacia la cámara). Empieza oculta (`visible="false"`).
- Fondo de 2.8 × 1.45.
- Hijos: `#nombre`, `#precio`, `#descripcion` y el botón `#cerrarFicha` (local `0 -0.53 0.04`, clase `interactivo`).

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
| Rig | `#jugador` | `0 0 0` | Componente `caminar-quest` |
| Cámara | `#camara` | `0 1.6 0` (local) | Cursor `rayOrigin: mouse` para clics en PC. En PC se mueve con WASD sin límites |
| Mando izquierdo | `#mando-izquierdo` | — | `laser-controls`. El joystick mueve el rig |
| Mando derecho | — | — | `laser-controls` para seleccionar |

Los tres raycasters filtran por `.interactivo` (los mandos con `far: 10`).

`caminar-quest` solo actúa en modo VR, a 1.2 m/s, y limita el rig a
x −4.8..4.8 y z −4.8..1.6.

## Dependencias

- **A-Frame 1.8.0** desde el CDN `https://aframe.io/releases/1.8.0/aframe.min.js`. Sin conexión la escena no carga.
- **Orden de los scripts**: `catalogo.js` debe cargarse antes que `app.js`, porque define `window.catalogoArteAnc`. Ambos están al final del `<body>`, después de la escena.
- **`catalogo.js`**: claves `pieza01`, `pieza02` y `pieza03`, que deben coincidir con los `id` de los productos.
- **`app.js`** necesita que existan estos ids en `index.html`:
  `#ficha`, `#nombre`, `#precio`, `#descripcion`, `#cerrarFicha`, `#pieza02`,
  `#baldosas`, `#camara`, `#mando-izquierdo`, `#botonPuerta`,
  `#botonPuertaExterior`, `#textoPuerta`, `#textoPuertaExterior`,
  `#puertaIzquierda`, `#puertaDerecha`, `#mostradorRecepcion` y
  `#bienvenidaRecepcion`.
  Además usa `.producto` para los clics de producto. La clase `.interactivo` la usan los raycasters.
- **Modelos**: solo `modelos/Untitle123d.glb` se usa en la escena. Los demás `.glb` de `modelos/` no están referenciados.
- Para que el `.glb` cargue, la escena debe servirse por HTTP; con `file://` no funciona.

## Observaciones (sin corregir)

- El texto "ARTEANC" del frente del mostrador (`-3.7 0.75 0.91`) no tiene rotación, así que su cara visible mira hacia +z, hacia el propio mostrador. Desde la galería se ve por detrás y probablemente no aparezca. Para que mire a la galería necesitaría `rotation="0 180 0"`.
- En PC, la cámara se mueve con WASD sin los límites de `caminar-quest`, así que se pueden atravesar las paredes.
