# Prompt — Diseño final congelado de "La Casa ArteAnc"

Para ChatGPT en modo Work, con acceso a las carpetas de los dos prototipos.
Copia el bloque completo. El resultado será la **referencia única** para
construir la escena (Fase 4 del [plan maestro](../PLAN_MAESTRO.md)).

- **Prototipo 1** = carpeta `ArteAnc_VR_v1` ("Santuario andino contemporáneo").
- **Prototipo 2** = carpeta `adasd/docs/diseno` ("La Casa ArteAnc").

---

```
Actúa como director de arte y arquitecto de experiencias inmersivas.

Tienes acceso a dos propuestas anteriores para ArteAnc VR, una tienda-museo
virtual de arte andino y precolombino que se recorrerá con Meta Quest 3 desde el
navegador (A-Frame/WebXR):

- PROTOTIPO 1 (carpeta ArteAnc_VR_v1): "Santuario andino contemporáneo".
  Revisa README.md, Manual_diseno.md, Guia_implementacion.md, layout.json,
  producto_ejemplo.json e imagenes/concepto_A.png.
- PROTOTIPO 2 (carpeta docs/diseno): "La Casa ArteAnc".
  Revisa README.md, 02-planta.svg, 06-kit-arquitectonico.png y todas las láminas.

Lee ambos completos antes de empezar.

## Tu tarea
Crear el DISEÑO FINAL CONGELADO v1.0: una sola versión definitiva, coherente en
todas sus láminas, que combine los dos prototipos según las decisiones de abajo.
No propongas nuevas direcciones artísticas: ejecuta esta. Si detectas un
conflicto, resuélvelo con el criterio más fácil de construir y anótalo.

## Decisiones ya tomadas (no cambiarlas)
1. BASE = PROTOTIPO 2: casa andina con patio central, kit arquitectónico
   modular, puertas trapezoidales de sillería, adobe encalado, vigas de madera,
   zócalo de piedra, franjas de color en el suelo que guían a cada sala, y su
   estilo de interfaz (paneles marfil, Cormorant Garamond para títulos e Inter
   para información).
2. NÚCLEO = PROTOTIPO 1, concepto A: el "Santuario precolombino" es la sala
   principal y más valiosa. Es la única con tratamiento monumental: muros altos
   de piedra clara, portal trapezoidal profundo, hornacinas forradas en bronce,
   peanas de basalto oscuro, luz que entra por una ranura longitudinal en el
   techo y acentos ámbar. Debe sentirse como el corazón de la casa.
3. Del PROTOTIPO 1 conserva también: contrato de datos (null = desconocido,
   precio ficticio marcado), estados de la ficha (cargando, disponible,
   agotado, error, sin conexión), pruebas de aceptación y el formato de
   layout.json.
4. Elimina las hojas de puerta de madera: todos los accesos son marcos
   trapezoidales abiertos (en VR las puertas cerradas estorban y bloquean la vista).
5. Nada de sofás, alfombras, plantas decorativas, estanterías de hotel,
   ventanales con paisaje ni suelos brillantes.

## Planta fija (simétrica sobre el eje norte–sur)
Coordenadas en metros. Origen (0, 0, 0) en el centro del umbral de la entrada
sur. Eje X = este, eje Y = arriba, norte = −Z. Muros de 0,40 m. Medidas libres
interiores.

| Espacio | Ubicación | Medidas (ancho X × fondo Z × alto) | Color de acento |
|---|---|---|---|
| Umbral / Recepción | sur, centrada en el eje | 8 × 6 × 4 m | madera #A98158 |
| Metal, piedra e instrumentos | suroeste, junto a recepción | 8 × 6 × 4 m | índigo #344660 + dorado #B4975A |
| Taller / Mesa de examen | sureste, junto a recepción | 8 × 6 × 4 m | ocre neutro, luz de examen neutra |
| Patio central | centro, a cielo abierto | 10 × 10 m | — |
| Cerámica | oeste del patio | 8 × 10 × 4 m | terracota #B96645 |
| Textiles | este del patio | 8 × 10 × 4 m | cochinilla #9E3441 |
| Santuario precolombino | norte, en el eje, remate del recorrido | 12 × 10 × 6,5 m | bronce #795A44 + basalto #302A27 |

- Cada sala y cada sala del sur tiene su propio acceso desde el patio. La
  recepción conecta la entrada sur con el patio.
- El patio tiene en el eje: peana con la "pieza de la semana" (0,50 × 0,50 × 1 m)
  y, al norte de ella, un canal de agua de piedra de 4 × 0,50 m que conduce la
  mirada hacia el portal del Santuario.
- Accesos normales: puerta trapezoidal de 2,60 m de alto, 1,60 m de base,
  1,30 m arriba. Portal del Santuario: 4,20 m de alto, 2,40 m de base, 1,90 m
  arriba y 1,20 m de profundidad (paso en sombra antes de la luz).
- Paso libre mínimo de 1,80 m entre muebles.

## Exhibición (escala humana)
- Ojos a 1,60 m de pie y 1,20 m sentado. Piezas pequeñas centradas a 1,10–1,40 m.
- Peanas: 0,50 × 0,50 m, 0,90–1,05 m de alto (piedra en salas normales, basalto
  en el Santuario). Vitrinas: 0,60 × 0,60 × 1,60 m, base de 0,90 m, vidrio sencillo.
- Cartela de 0,50 × 0,35 m inclinada junto a cada pieza.
- Cerámica, Textiles y Santuario: 8–12 piezas. Salas del sur: 6–8 piezas.
- Santuario: 6–8 hornacinas forradas en bronce en los muros laterales y 3 peanas
  de basalto sobre el eje central, la última bajo la luz de la ranura.

## Luz y atmósfera (idénticas en todas las láminas)
- Hora fija: final de la tarde, luz cálida pero natural (no atardecer
  dramático). Cielo despejado con degradado suave.
- Salas: luz suave de galería con acentos puntuales cálidos (~3000 K).
- Taller: luz de examen neutra (~4000 K), foco articulado de luz rasante.
- Santuario: más penumbra; la luz principal baja desde la ranura del techo,
  hornacinas iluminadas en ámbar. Contraste dramático pero legible.
- Todo debe poder resolverse con iluminación precalculada (horneada): sin
  efectos volumétricos, sin reflejos complejos, agua del canal plana.

## Cultura y comercio
- Arquitectura de inspiración andina, estilizada. No reproduzcas ningún sitio
  arqueológico real ni uses iconografía sagrada como decoración.
- Las piezas de las imágenes son ilustrativas. No inventes atribuciones, fechas
  ni procedencias. Toda ficha muestra el tipo de pieza: "original documentado",
  "réplica" o "artesanía contemporánea". En el Santuario este dato es
  especialmente visible.

## Entregables (en este orden; cada uno coherente con la planta)
Guárdalos en una carpeta final/ con estos nombres:

1. 01-planta.svg y 01-planta.png: planta acotada con coordenadas, ejes, accesos,
   posición de cada peana, vitrina y hornacina, recorrido sugerido y escala.
2. 02-layout.json: mismo formato que layout.json del Prototipo 1, con todas
   las salas, accesos (con sus medidas trapezoidales) y una lista
   "exhibitSlots" con id, sala, tipo (peana/vitrina/hornacina/mesa),
   posición [x, y, z] de la superficie donde se apoya la pieza y orientación.
3. 03-axonometrica.png: vista sin cubierta de toda la casa.
4. Vistas a la altura de los ojos (1,60 m), 16:9:
   04a-umbral.png (desde la entrada hacia el patio y el portal del Santuario al fondo)
   04b-patio.png (mirando al norte: pieza de la semana, canal y portal del Santuario)
   04c-santuario-portal.png (cruzando el portal)
   04d-santuario-interior.png (interior completo con la ranura de luz)
   04e-ceramica.png
   04f-textiles.png
   04g-metal-piedra-instrumentos.png
   04h-taller.png
5. Interfaz VR (estilo del Prototipo 2):
   05a-cartela.png
   05b-ficha.png (con chip de tipo de pieza y un pequeño esquema de los estados:
   cargando / disponible / agotado / error)
   05c-ficha-santuario.png (variante con "Historia y fuentes")
   05d-favoritos.png (en el mostrador de la recepción)
   05e-tutorial.png (teletransporte, giro de 30°, tomar piezas)
6. 06-kit.png: kit del Prototipo 2 más las piezas del Santuario (portal
   monumental, hornacina con forro de bronce, peana de basalto, ranura de luz),
   cada una con medidas.
7. DISENO_FINAL.md: especificación escrita con:
   - tabla de espacios con medidas y coordenadas;
   - paleta completa (hex) y materiales con rugosidad sugerida;
   - luz por espacio;
   - lista del kit;
   - qué se tomó de cada prototipo y qué se descartó;
   - regla: "la planta y el layout.json mandan sobre las imágenes";
   - tabla de verificación: cada imagen comparada con la planta, con las
     diferencias encontradas (sé honesto; mejor anotar una diferencia que ocultarla);
   - pendientes y riesgos para la construcción en Quest 3.

## Reglas de coherencia
- Genera la planta y el layout.json PRIMERO y úsalos como referencia de cada imagen.
- Mismos materiales, colores, hora del día y tipografía en todas las láminas.
- Si una imagen sale con un elemento prohibido (puerta de madera, sofá, suelo
  brillante, ventanal) o no coincide con la planta, rehazla antes de continuar.
- Evita texto largo dentro de las imágenes; los nombres de sala sí deben verse.
- Nada de personas (como mucho, una silueta para la escala).
- Entrega todo en un ZIP con la carpeta final/.
```

---

## Después de recibir el resultado
1. Claude revisa cada lámina contra la planta y el `layout.json`.
2. Lo aprobado se mueve a `docs/diseno/final/` con las imágenes comprimidas.
3. `02-layout.json` se convierte en la base de `datos/salas.json` (Fase 1).
