# Visión de producto — ArteAnc VR

## En una frase

**Una casa-museo andina en la web, donde cualquier persona con un Quest 3 o un
navegador puede recorrer, examinar de cerca y comprar piezas reales de ArteAnc,
mientras aprende la historia de las culturas que las inspiraron.**

## Principios

1. **La pieza es la protagonista.** La arquitectura, la luz y el sonido existen
   para presentar el objeto, nunca para competir con él.
2. **Examinar es mejor que mirar.** La gran ventaja de la VR sobre una foto es
   tomar el objeto, girarlo y verlo a escala real. Esa es la experiencia central.
3. **Confort ante todo.** Nadie compra si se marea. Teletransporte, giros por
   pasos, textos legibles y modo sentado desde la primera versión.
4. **Cultura con respeto y rigor.** Cada texto histórico debe poder verificarse.
   Cada pieza declara con claridad qué es: original con documentación, réplica o
   artesanía contemporánea.
5. **Un enlace basta.** Sin instalar apps: se abre en el navegador del Quest, del
   PC o del móvil.
6. **Modular.** Cada sala, pieza y función es un módulo independiente que se
   puede agregar, quitar o cambiar sin romper el resto.

## El concepto: "La Casa ArteAnc"

> **Actualización 2026-11-08:** el esquema de esta sección fue el punto de
> partida. La distribución definitiva está **congelada** en
> [diseno/final/](diseno/final/): recepción al sur entre las salas Metal/piedra/instrumentos
> y Taller; galería sur abierta; patio de 10 × 10 m; Cerámica al oeste;
> Textiles al este; y el **Santuario precolombino** (12 × 10 × 6,5 m) como
> remate monumental en el eje norte. Ante cualquier diferencia, manda
> `diseno/final/02-layout.json`.

La propuesta es dejar la sala única y organizar el espacio como una casa
andina con **patio central**. Es una tipología real de la arquitectura de los
Andes (de las kanchas incas a las casonas coloniales), y además resuelve
problemas de diseño:

- **Orientación fácil.** Desde el patio se ven las puertas a todas las salas, y
  siempre se puede volver al centro. No hay laberintos.
- **Modularidad.** Cada sala es un módulo que se conecta al patio. Agregar una
  sala nueva no obliga a rediseñar las demás.
- **Rendimiento.** Solo hace falta cargar en detalle la sala visible.

```
                 ┌───────────────┐
                 │  SALA 2       │
                 │  Textiles     │
     ┌───────────┴──┐  ┌─────────┴───┐
     │  SALA 1      │  │  SALA 3     │
     │  Cerámica    │  │  Metales /  │
     │              │  │  Arte pop.  │
     └───────┬──────┘  └──────┬──────┘
             │   PATIO CENTRAL │
             │ (cielo abierto, │
             │ pieza destacada)│
     ┌───────┴──────┐  ┌──────┴──────┐
     │  UMBRAL /    │  │  TALLER /   │
     │  RECEPCIÓN   │  │  MESA DE    │
     │  (entrada)   │  │  EXAMEN     │
     └──────────────┘  └─────────────┘
```

Los nombres de las salas son ejemplos. **Las salas deben salir de las
categorías reales del catálogo de ArteAnc.**

### Espacios

| Espacio | Función | Experiencia |
|---|---|---|
| **Umbral / Recepción** | Bienvenida y orientación | Breve tutorial de controles (mirar, teletransportarse, tomar piezas). Opciones: "recorrido guiado" o "explorar libre". Selector de idioma. |
| **Patio central** | Punto de referencia y distribución | Cielo abierto con luz natural y una pieza destacada que rota cada semana. Desde aquí se ven todas las puertas. |
| **Salas temáticas** | Exposición y venta | 6–12 piezas por sala, con vitrinas a altura cómoda y una cartela junto a cada pieza. Paneles con un mapa, una línea de tiempo y el contexto cultural. |
| **Taller / Mesa de examen** | Inspección detallada | Mesa bien iluminada donde se coloca cualquier pieza para verla de cerca, con luz rasante, lupa, regla de escala y comparación lado a lado. |
| **Mostrador de cierre** | Conversión | Repaso de la lista de favoritos y paso a la compra en arteanc.com. |

## Identidad visual

- **Arquitectura:** muros de sillería, puertas y hornacinas trapezoidales (el
  rasgo más reconocible de la arquitectura inca), dinteles de piedra, vigas de
  madera y adobe. Estilizada, no una réplica literal de ningún sitio.
- **Materiales:** piedra, adobe encalado, madera oscura y textiles.
- **Paleta:** tierras y ocres (la actual, `#493021`, `#A98158`, `#D5C5B0`, es un
  buen punto de partida), con acentos de color textil (rojo cochinilla, índigo
  y amarillo) para orientar al visitante.
- **Motivos:** patrones geométricos textiles (tocapus) como señalética. Cada
  sala tiene un color y un motivo propios que se repiten en su puerta y en el suelo.
- **Tipografía:** una fuente con tildes y eñes en formato MSDF para VR, y la
  misma familia en la web de ArteAnc.
- **Sonido:** ambiente suave por sala (viento, agua del patio, instrumentos
  andinos muy discretos) y audio espacial para las narraciones de las piezas.

> Antes de la Fase 4 hay que confirmar con ArteAnc su logo, colores y
> tipografías oficiales.

## Escala humana y confort

| Elemento | Medida recomendada | Motivo |
|---|---|---|
| Altura de los ojos de pie / sentado | 1.6 m / 1.2 m | Valores de referencia para colocar contenido |
| Centro de las piezas pequeñas | 1.1–1.4 m | Cómodo de pie y sentado |
| Peanas para piezas pequeñas | 0.9–1.05 m de alto, 0.4–0.6 m de ancho | Proporción de museo real (hoy: 1 m de alto y 1.3 m de diámetro) |
| Vitrinas | Base a 0.9 m, vidrio hasta ~1.6 m | El visitante se acerca sin chocar |
| Cartelas | 0.5 × 0.35 m, inclinadas 15–20°, junto a la pieza | Se leen sin girar la cabeza |
| Texto en VR | Altura de letra ≥ 2 cm a 1.5 m de distancia | Legibilidad en el visor |
| Pasillos | ≥ 1.8 m | Libertad de movimiento y teletransporte cómodo |
| Altura de las salas | 3.5–4.5 m | Sensación de amplitud sin vacío |

## Experiencias que hacen única a ArteAnc VR

Además de las ideas del brief, propongo:

1. **"Tómala en tus manos".** Con los controles o con seguimiento de manos se
   toma la pieza, se gira y se acerca. Al soltarla vuelve sola a su sitio.
2. **Luz rasante.** En la mesa de examen, un foco movible revela textura,
   marcas de herramienta y relieve. Así examina un tasador real.
3. **Escala verdadera.** Junto a cada pieza aparecen una mano o una regla de
   referencia. Las fotos engañan con el tamaño; la VR no.
4. **"Pruébala en tu casa" (realidad mixta).** El Quest 3 permite sesiones
   `immersive-ar` con passthrough desde el navegador: la persona ve su propia sala
   y coloca la pieza sobre su mesa, a escala real, antes de comprar. Es una
   razón muy concreta para comprar. Va después del lanzamiento, pero la
   arquitectura debe prepararse para ella.
5. **La historia detrás del objeto.** Narración breve por pieza (cultura,
   técnica, simbolismo) y, si existe, la voz o la imagen del artesano.
6. **Línea de tiempo caminable.** En el patio o en un pasillo, un suelo que
   recorre las culturas andinas por periodos, con piezas ubicadas en su época.
7. **Lista para después.** Las piezas que gustan se guardan, y la lista se envía al
   correo o se abre en el PC con un código corto. Nadie quiere teclear la
   tarjeta dentro del visor.
8. **Pieza de la semana.** El patio cambia de protagonista. Da un motivo para volver.
9. **Visita con un vendedor (futuro).** Una sesión compartida en la que alguien de
   ArteAnc guía al cliente en tiempo real, como en una galería física.

## Comercio y confianza

- **La compra se cierra en arteanc.com.** La VR es el escaparate y la sala de
  examen; el pago, el envío y la aduana siguen en la tienda.
- **Cada pieza declara su naturaleza**: original con documentación de procedencia,
  réplica o artesanía contemporánea. Las leyes de patrimonio de Perú y de otros
  países andinos restringen el comercio y la exportación de bienes arqueológicos
  originales. Mostrar esto con claridad protege a ArteAnc y genera confianza.
  *Este punto debe revisarlo ArteAnc con asesoría legal; aquí solo se señala
  como requisito del producto.*
- **Ficha de producto en VR**: nombre, precio, cultura de inspiración, época,
  material, técnica, dimensiones, tipo de pieza, disponibilidad y botón
  "ver en la tienda".

## Qué NO es ArteAnc VR (por ahora)

- No es un videojuego: no hay puntuaciones, misiones ni personajes.
- No es una réplica exacta de un sitio arqueológico real.
- No procesa pagos dentro de la VR.
- No es una app de tienda (Meta Store). Es una web.
