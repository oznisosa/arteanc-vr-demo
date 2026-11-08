# Guía de las salas — `datos/salas.json`

`datos/salas.json` describe **la Casa ArteAnc completa**: salas, accesos,
posiciones de exhibición y elementos fijos. Lo usará el constructor del
*greybox* (módulo 1.7) para levantar la casa a escala real.

## De dónde sale (no se edita a mano)

```
docs/diseno/final/02-layout.json  ──(npm run salas)──▶  datos/salas.json
   diseño congelado v1.0 (DT-009)                         datos de la escena
   claves en inglés, todo el detalle                       claves en español, lo necesario
```

- **La fuente de verdad es `02-layout.json`** (DT-009, DT-015). `salas.json`
  se **genera** con `npm run salas` (`herramientas/generar-salas.js`).
- **No editar `salas.json` a mano**: se sobrescribe. `npm run validar` (y por
  tanto cada build) **falla** si no coincide con el diseño.
- Para cambiar la casa: nueva versión del diseño (v1.1…, registrada en
  DECISIONES.md) → `npm run salas` → `npm run validar`.

## Coordenadas (regla 6 de `CLAUDE.md`)

1 unidad = 1 m · origen `(0, 0, 0)` en el centro del umbral sur ·
**X = este**, **Y = arriba**, **norte = −Z**. Orientación en grados `[X, Y, Z]`;
en Y: **0 = mira al sur (+Z)**, 90 = este, 180 = norte, 270 = oeste.

## Qué contiene

| Clave | Qué es | Cuántos |
|---|---|---|
| `salas` | `id`, `nombre`, `centro` (centro del suelo interior), `tamano` = **medidas libres interiores** `[ancho X, alto Y, fondo Z]` (no restar el muro otra vez), `acento` (color), `cieloAbierto`, `papel` (`sala` o `circulacion`) | 8 |
| `accesos` | Huecos trapezoidales sin puerta: `desde` / `hacia`, `centro` (suelo, mitad del espesor del muro), `muro` (`este-oeste` o `norte-sur`), `anchoBase`, `anchoSuperior`, `alto`, `fondo`, `modulo` | 7 |
| `posiciones` | Donde va cada pieza: `sala`, `tipo` (peana, vitrina, mesa, hornacina), `apoyo` = **centro de la superficie donde se apoya la pieza** (no la base del mueble), `orientacion`, `tamanoSoporte`, `altoPieza` (referencia del diseño), `cartela`, y a veces `tamanoPanel` y `presentacion` | 38 |
| `elementos` | Fijos: canal de agua, mostrador, lámpara, regla y lupa del taller | 5 |
| `arquitectura` | Portal del Santuario, cierre norte del patio, galería sur, módulo de hornacina, ranura cenital | — |
| `recorrido` | Orden de visita recomendado | — |

### Salas
| id | Nombre | Tamaño libre (m) | Posiciones |
|---|---|---|---|
| `recepcion` | Umbral / Recepción | 8 × 4 × 6 | 0 (acogida y favoritos) |
| `metal` | Metal, piedra e instrumentos | 8 × 4 × 6 | 6 |
| `taller` | Taller / Mesa de examen | 8 × 4 × 6 | 6 |
| `galeria_sur` | Galería sur del patio (circulación, cielo abierto) | 24,8 × 4 × 2 | 0 |
| `patio` | Patio central (cielo abierto) | 10 × 4 × 10 | 1 (pieza de la semana) |
| `ceramica` | Cerámica | 8 × 4 × 10 | 8 |
| `textiles` | Textiles | 8 × 4 × 10 | 8 |
| `santuario` | Santuario precolombino | 12 × 6,5 × 10 | 9 |

## Lo que comprueba `npm run validar`

1. Que `salas.json` está **al día** con `02-layout.json`.
2. Que las salas **no se solapan**.
3. Que cada **acceso** está en el muro entre las dos salas que une, y que el
   trapecio es más estrecho arriba que abajo.
4. Que cada **posición** cae dentro de su sala (las hornacinas, dentro del
   espesor del muro) y a una altura posible.
5. Que el número de posiciones por sala es el que prevé el diseño.
6. Que las salas que usa `datos/catalogo.json` existen.

## Qué NO está aquí

- **Qué pieza va en cada posición.** Eso lo decide el catálogo (se definirá
  en el módulo 1.7). El `objectType` de las piezas de referencia del diseño
  no se copia: la clasificación comercial manda en el catálogo (DT-014).
- Las cámaras de las láminas del diseño (`cameraViews`): solo sirven para las imágenes.
