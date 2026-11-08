# Guía del catálogo — `datos/catalogo.json`

El catálogo es la lista de piezas de ArteAnc VR. **Para cambiar los datos de
una pieza solo se edita este archivo**; la escena los lee al cargar.
Basado en el contrato del diseño final ([DISENO_FINAL.md §7–8](diseno/final/DISENO_FINAL.md))
con la ampliación de [DT-014](DECISIONES.md).

## Cómo editarlo sin romperlo

1. Abrir `datos/catalogo.json` en VS Code (colorea el JSON y marca errores en rojo).
2. Cambiar solo los **valores** (lo que va después de los dos puntos).
3. En PowerShell: `npm run validar`. Debe decir `✓ … piezas correctas`.
   Si hay errores, el mensaje dice la pieza y el campo.
4. `npm run dev` y comprobar la ficha.

**Reglas de JSON que más fallan:** los textos van entre comillas dobles
`"así"`; los números y `null`, sin comillas; no se pone coma después del
último elemento de una lista o de un objeto.

> `npm run build` ejecuta la validación primero: si el catálogo tiene un
> error, **GitHub no publica** y la web anterior sigue en pie.

## Regla de oro: `null` = desconocido

`null` no significa cero, gratis ni agotado: significa **"no lo sabemos"**.
Nunca rellenar un dato con algo "plausible". Si no hay documentación de la
cultura o la época, se deja `null` y la ficha no lo mostrará.

## Campos de cada pieza

| Campo | Qué es | Ejemplo | Si no se sabe |
|---|---|---|---|
| `id` | Nombre de la pieza en la escena (en `index.html`). Desde el módulo 1.4 saldrá de las posiciones del diseño | `"pieza01"` | obligatorio |
| `sku` | Código del producto en la tienda | `"ARTE-0123"` | obligatorio, único |
| `titulo` | Nombre visible, **con tildes** | `"Vasija retrato"` | obligatorio |
| `descripcion` | Texto corto de la ficha | `"Vasija de asa estribo…"` | `null` |
| `sala` | Sala del diseño final | `"santuario"` | `null` |
| `posicion` | Posición de exhibición en la casa (`datos/salas.json`): la pieza aparece ahí en `casa.html`. Debe ser de la misma sala y no estar ocupada | `"S07"` | `null` (no se expone en la casa) |
| `tipoPieza` | Clasificación (tabla de abajo) | `"artesania_tradicional"` | `null` → "Sin clasificación verificada" |
| `tipoPiezaEsIlustrativo` | `true` si la clasificación es de demostración | `true` | — |
| `naturaleza` | `"producto"` (se vende) o `"demostracion_no_vendible"` | `"producto"` | — |
| `cultura` | Cultura de origen, solo si está documentada | `"Moche"` | `null` |
| `epoca` | Periodo, solo si está documentado | `"100–700 d. C."` | `null` |
| `material` | Material principal | `"Cerámica policromada"` | `null` |
| `dimensiones_m` | Medidas reales **en metros** | `{ "alto": 0.24, "ancho": 0.16, "fondo": 0.18 }` | `null` |
| `procedencia` | Origen y documentación legal (sobre todo en originales) | `"Colección X, certificado n.º…"` | `null` |
| `fuentes` | Lista de referencias que respaldan cultura, época o procedencia | `["Catálogo del Museo Larco, p. 12"]` | `[]` |
| `estadoEditorial` | `"pendiente"`, `"revisado"` o `"publicado"` | `"revisado"` | — |
| `moneda` | `"USD"`, `"PEN"` o `"EUR"` | `"USD"` | — |
| `precio` | Número **sin comillas** | `120` | `null` |
| `precioEsFicticio` | `true` si el precio es solo para probar | `false` | — |
| `stock` | Unidades disponibles; `0` = agotado | `1` | `null` |
| `urlProducto` | Página de la pieza en arteanc.com | `"https://arteanc.com/…"` | `null` |
| `modelos.galeria` | Modelo ligero (≤ 3 MB, DT-012) | `"modelos/vasija-001-galeria.glb"` | `null` |
| `modelos.examen` | Modelo detallado (≤ ~10 MB) | `"modelos/vasija-001-examen.glb"` | `null` |
| `actualizadoEn` | Fecha de la última revisión | `"2026-11-08"` | `null` |

## Tipos de pieza (`tipoPieza`)

| Valor | Se ve como | Dónde se usa (demo) | Regla |
|---|---|---|---|
| `original_documentado` | Original documentado | Santuario precolombino | Exige documentación revisada **de esa pieza** (`fuentes` y `procedencia`). ⚠️ Ver aviso legal |
| `replica` | Réplica | — | Indicar qué pieza reproduce, sin atribuir la antigüedad al objeto vendido |
| `artesania_tradicional` | Artesanía tradicional peruana | Resto de salas | Técnicas y estilos tradicionales; no atribuye por sí sola cultura antigua ni fecha |
| `artesania_contemporanea` | Artesanía contemporánea | — | Obra actual de autor |
| `null` | Sin clasificación verificada | — | No se puede vender hasta clasificarla |

> ⚠️ **Aviso legal (piezas precolombinas originales).** En el Perú, los bienes
> arqueológicos prehispánicos son Patrimonio Cultural de la Nación
> (Ley 28296), con fuertes restricciones de comercio y exportación; otros
> países también limitan su importación. Antes de poner a la venta piezas
> `original_documentado`, ArteAnc debe confirmar su situación legal con un
> especialista (módulo 7.5). Si son réplicas, usar `replica`.

## Salas (`sala`)

`recepcion`, `patio`, `galeria_sur`, `ceramica`, `textiles`, `metal`
(Metal, piedra e instrumentos), `santuario` (Santuario precolombino), `taller`.
Son los `id` de `docs/diseno/final/02-layout.json`.

## Lo que el validador comprueba (`npm run validar`)

- Que el archivo sea JSON válido.
- Que cada pieza tenga **todos** los campos (con valor o `null`) y ninguno mal escrito.
- Que `tipoPieza`, `naturaleza`, `sala`, `estadoEditorial` y `moneda` sean valores permitidos.
- Que no se repitan `id` ni `sku`; que `precio` y `stock` sean números.
- Que cada `posicion` exista en `datos/salas.json`, sea de la misma sala que la
  pieza y no la ocupe otra pieza. La lista de posiciones por sala está en
  [SALAS.md](SALAS.md) y en `docs/diseno/final/01-planta.png` (C01…C08, T01…T08,
  M01…M06, W01…W06, S01…S09, P01).
- Que un `"producto"` en venta no sea ilustrativo, tenga `tipoPieza`, y si es
  `original_documentado`, al menos una fuente.
