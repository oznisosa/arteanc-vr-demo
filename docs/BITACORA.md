# Bitácora de cambios — ArteAnc VR

> **Nota para ChatGPT (tutor):** este archivo lo escribe Claude Code cada vez que
> modifica el proyecto junto con Ozni. Cada entrada explica qué cambió, por qué
> y qué conceptos aparecen, para que puedas usarla como material de enseñanza.
> El mapa de coordenadas de la escena está en `docs/MAPA_ESCENA.md`.
> Las entradas más recientes van primero.

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
