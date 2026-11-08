# Arquitectura tecnológica — ArteAnc VR

## 1. Recomendación

**Seguir con A-Frame para la versión 1.0 y reorganizar el proyecto con datos,
componentes y un proceso de optimización de modelos.** La decisión queda
registrada en [DECISIONES.md](DECISIONES.md) (DT-001).

A-Frame no es el cuello de botella del proyecto. Debajo de A-Frame está
**Three.js**, el mismo motor que usan las alternativas web más populares. Los
problemas actuales (modelos de 19 MB, escena escrita a mano, iluminación
plana) se repetirían con cualquier otra tecnología si no se resuelven sus causas.

## 2. Alternativas evaluadas

| Opción | Ventajas | Desventajas para ArteAnc | Veredicto |
|---|---|---|---|
| **A-Frame** (actual) | HTML declarativo, fácil de aprender; patrón entidad-componente; buen soporte de WebXR y controles del Quest; acceso directo a Three.js; comunidad activa (1.8.0 actualizó a Three.js r184) | Menos herramientas visuales; los proyectos grandes necesitan disciplina para no desordenarse | ✅ **Seguir** |
| **Three.js puro** | Control total; la mayor comunidad 3D web | Más código para lo mismo (controles, raycast, VR); se pierde la curva de aprendizaje suave | Solo si A-Frame limita |
| **React Three Fiber + @react-three/xr** | Ecosistema moderno; buen manejo del estado de la UI | Exige aprender React además de 3D; reescritura completa | ❌ No por ahora |
| **Babylon.js** | Motor completo con inspector, buen WebXR y físicas | Reescritura completa; otro ecosistema | ❌ No justifica el cambio |
| **PlayCanvas** | Editor visual en la nube; muy buen rendimiento | El editor colaborativo completo es de pago; código menos transparente para aprender | Alternativa si se necesita un editor |
| **Needle Engine** | Se diseña en Unity o Blender y se publica en la web | Añade Unity a la cadena; licencias | Interesante para el futuro |
| **App nativa (Unity / Godot) para Meta Store** | La mejor calidad gráfica posible | Se pierde "un enlace basta"; revisión de tienda; compra más difícil; mucho más trabajo | ❌ No para la v1 |

### Cuándo reconsiderarlo (señales de alerta)
- Si con modelos ya optimizados no se mantienen 72 fps en el Quest 3.
- Si el equipo crece y necesita un editor visual compartido.
- Si una función clave (multijugador, físicas complejas) no tiene solución madura en A-Frame.

Si aparece una de estas señales, el siguiente paso natural es **Three.js con
módulos propios**. Los componentes de A-Frame ya contienen código Three.js, así
que la migración sería parcial, no total.

## 3. Arquitectura objetivo

```
┌──────────────────────────────────────────────────────────────┐
│                         NAVEGADOR                            │
│  ┌───────────────┐   ┌─────────────────┐   ┌──────────────┐  │
│  │ DATOS (JSON)  │──▶│ CONSTRUCTOR DE  │──▶│ ESCENA       │  │
│  │ catálogo      │   │ ESCENA          │   │ A-Frame      │  │
│  │ salas         │   │ (lee los datos  │   │ (entidades + │  │
│  │ textos/idioma │   │ y crea las      │   │ componentes) │  │
│  └───────────────┘   │ entidades)      │   └──────┬───────┘  │
│                      └─────────────────┘          │          │
│  ┌──────────────────────────────────────────────┐ │          │
│  │ COMPONENTES PROPIOS                          │◀┘          │
│  │ pieza-exhibida · ficha-producto · inspeccion │            │
│  │ locomocion · teletransporte · favoritos ...  │            │
│  └──────────────────────────────────────────────┘            │
│  ┌──────────────────────────────────────────────┐            │
│  │ SERVICIOS: estado, idioma, analítica,        │            │
│  │ enlace a la tienda                           │            │
│  └──────────────────────────────────────────────┘            │
└──────────────────────────────────────────────────────────────┘
          │ enlaces de compra                │ (futuro) API
          ▼                                  ▼
     arteanc.com                     catálogo sincronizado
```

### Idea central: **la escena se construye a partir de datos**
Hoy, agregar una pieza exige escribir HTML y calcular coordenadas. En la
arquitectura objetivo basta con añadir una entrada al JSON:

```json
{
  "id": "ceramica-moche-001",
  "nombre": { "es": "Vasija retrato", "en": "Portrait vessel" },
  "precio": { "monto": 120, "moneda": "USD" },
  "tipo": "replica",
  "cultura": "Moche",
  "epoca": "100–700 d. C. (estilo)",
  "material": "Cerámica policromada",
  "dimensiones_cm": { "alto": 24, "ancho": 16, "profundo": 18 },
  "descripcion": { "es": "...", "en": "..." },
  "modelo": "modelos/optimizados/ceramica-moche-001.glb",
  "url_tienda": "https://arteanc.com/...",
  "sala": "ceramica",
  "destacada": false
}
```

> **Actualización 2026-11-08 — contrato oficial.** El formato que manda es el
> del diseño final: [diseno/final/producto_ejemplo.json](diseno/final/producto_ejemplo.json)
> y [DISENO_FINAL.md §8](diseno/final/DISENO_FINAL.md). Sus campos son `sku`, `titulo`,
> `naturaleza`, `tipoPieza` (`original_documentado` / `replica` /
> `artesania_contemporanea` / `null`), `material`, `dimensiones_m`, `fuentes`,
> `estadoEditorial`, `moneda`, `precio`, `precioEsFicticio`, `stock`,
> `urlProducto`, `modelos.galeria`, `modelos.examen` y `actualizadoEn`.
> **`null` = desconocido** (no cero ni agotado). El ejemplo de arriba sirve
> solo para ilustrar campos editoriales opcionales (cultura, época), que se
> añadirán como extensión. La posición de cada pieza **no** va en el catálogo:
> sale de los `exhibitSlots` de `02-layout.json`, y el catálogo asigna un `sku` a cada slot.

Con ese dato, el componente `pieza-exhibida` coloca la peana, escala el modelo a
sus **dimensiones reales** (las que figuran en el catálogo, no "65 cm" fijos),
crea la cartela y conecta la ficha.

### Estructura de carpetas propuesta

> **Estado (0.4, 2026-11-08):** ya existen `src/main.js`, `src/componentes/`
> (`caminar-quest.js`) y dos carpetas provisionales: `src/escena/` (suelo,
> ajuste del modelo) y `src/interaccion/` (ficha, puertas, recepción). En la
> Fase 1 su contenido pasará a componentes y al constructor. El catálogo está
> en `src/datos/catalogo.js` hasta que sea `datos/catalogo.json` (1.1).

```
ArteAnc-VR/
├── index.html              ← escena mínima: carga módulos y entorno
├── package.json            ← dependencias y scripts (Vite, gltf-transform)
├── src/
│   ├── main.js             ← punto de entrada
│   ├── componentes/        ← un archivo por componente A-Frame
│   │   ├── pieza-exhibida.js
│   │   ├── ficha-producto.js
│   │   ├── locomocion.js
│   │   └── ...
│   ├── servicios/          ← estado, idioma, analítica
│   └── constructor/        ← crea salas y piezas desde los datos
├── datos/
│   ├── catalogo.json
│   ├── salas.json
│   └── textos/es.json, en.json
├── public/
│   ├── modelos/            ← SOLO modelos optimizados (galería ≤ 3 MB, examen ≤ ~10 MB)
│   ├── entorno/            ← arquitectura exportada desde Blender
│   ├── fuentes/            ← fuente MSDF con tildes
│   └── audio/
├── herramientas/           ← scripts de optimización de modelos
├── docs/
├── _fuentes-3d/            ← (ignorada por Git) escaneos originales, .blend
└── _archivo/               ← (ignorada por Git) entregas originales y copias antiguas
```

## 4. Herramientas propuestas

| Herramienta | Para qué | Cuándo |
|---|---|---|
| **Node.js + npm** | Gestionar dependencias y scripts | Fase 0 |
| **Vite** | Servidor de desarrollo con recarga automática y HTTPS para probar en el Quest por wifi; empaquetado optimizado para publicar | Fase 0 |
| **glTF-Transform** (CLI) | Optimizar modelos: simplificar geometría, comprimir (Meshopt), convertir texturas (KTX2/WebP) y redimensionar | Fase 3 |
| **Blender** | Limpiar escaneos; modelar la arquitectura; **hornear la iluminación** (*bake*) | Fases 3–4 |
| **RealityScan / RealityCapture** | Fotogrametría de los productos (ya en uso) | Continuo |
| **Inspector de A-Frame** (`Ctrl+Alt+I`) | Ajustar posiciones visualmente y copiar los valores | Desde ya |
| **Stats de A-Frame** (`stats` en `<a-scene>`) | Medir fps, llamadas de dibujo y triángulos | Desde la Fase 0 |
| **GitHub Pages** (o Netlify / Cloudflare Pages) | Publicación con HTTPS (WebXR lo exige) | Ya en uso |

## 5. Rendimiento en Meta Quest 3

El Quest 3 es un móvil potente dibujando dos pantallas de alta resolución.
**Presupuesto inicial**, unificado el 2026-11-08 con el del diseño final. Se
toma el valor más estricto de cada fuente, y hay que validarlo con mediciones
reales en la Fase 0:

| Métrica | Objetivo |
|---|---|
| Fotogramas por segundo | 72 estables (90 deseable) |
| Llamadas de dibujo (*draw calls*) visibles | objetivo < 100; alarma > 150 |
| Triángulos visibles por vista | < 250 000 |
| Descarga inicial | ≤ 20 MB |
| Texturas residentes | ≤ 256 MB |
| Peso por pieza (`.glb`) | galería ≤ 3 MB · examen ≤ ~10 MB, cargada solo al examinarla (DT-012) |
| Triángulos por pieza | galería 5 000–15 000 · examen 30 000–100 000 (dos versiones: `modelos.galeria` y `modelos.examen`) |
| Textura por pieza | galería 2048 px · examen hasta 4096 px; en KTX2 o WebP, con mapa de normales |
| Carga inicial hasta poder moverse | < 8 s con buena wifi |
| Luces dinámicas | Mínimas; iluminación horneada en la arquitectura |

**Técnicas clave:**
- **Iluminación horneada:** la luz y las sombras de la arquitectura se calculan una
  vez en Blender y se guardan en texturas. Se ve como un render y casi no cuesta.
- **Carga progresiva:** la sala visible se carga primero y el resto en segundo plano.
- **Mapa de entorno (HDRI)** para que la cerámica y el metal tengan reflejos
  creíbles sin luces caras.
- **Reutilizar geometrías** (peanas y vitrinas) y combinar mallas estáticas.

## 6. Proceso de modelos 3D (fotogrametría → web)

```
Fotos ──▶ RealityScan ──▶ Blender ────────────▶ glTF-Transform ──▶ public/modelos/
          (malla densa,   (limpiar, fijar        (simplificar,
           ~38 MB)         origen en la base,     Meshopt,
                           escala en metros,      KTX2; galería ≤ 3 MB
                                                  y examen ≤ ~10 MB)
                           orientación)
```

Reglas:
1. **El origen va en la base de la pieza**, para que "colocar sobre la peana" sea
   simplemente `y = altura de la peana`.
2. **La escala va en metros reales.** Una vasija de 24 cm mide 0.24 en el archivo.
3. **Nombres en minúsculas, sin espacios**, iguales al `id` del catálogo.
4. **Los originales no se suben a Git.** Se guardan en `_fuentes-3d/` (carpeta local ignorada por Git) y en un
   almacenamiento externo con copia de seguridad.

## 7. Navegación e interacción

| Función | Quest 3 (controles) | Quest 3 (manos) | PC | Móvil |
|---|---|---|---|---|
| Moverse | Teletransporte (joystick hacia delante) + movimiento continuo opcional | Pellizco y apuntar | WASD + clic en el suelo | Tocar el suelo |
| Girar | Giro por pasos de 30–45° | Gesto | Ratón | Arrastrar |
| Seleccionar | Láser + gatillo | Pellizco | Clic | Toque |
| Examinar pieza | Agarrar (grip) y girar | Tomar con la mano | Arrastrar para orbitar + rueda para zoom | Arrastrar / pellizcar |
| Colisiones | Áreas transitables definidas (*navmesh*) | Ídem | Ídem | Ídem |

El *navmesh* (malla de navegación) es una superficie invisible que define
dónde se puede caminar o teletransportarse. Evita atravesar paredes en
todas las plataformas a la vez.

## 8. Integración comercial

- **v1:** cada pieza tiene una `url_tienda`. El botón "Ver en la tienda" la
  abre. En el Quest, abrir un enlace saca de la VR, así que se ofrece a la vez
  **"Guardar para después"**.
- **Favoritos:** se guardan en el navegador (`localStorage`). Para pasarlos al PC,
  un enlace con la lista codificada, que se abre o se envía por correo.
- **Después del lanzamiento:** sincronizar el catálogo automáticamente desde
  arteanc.com. Depende de la plataforma de la tienda (Shopify, WooCommerce u
  otra; **por confirmar**), que define si hay una API disponible.
- **Analítica respetuosa con la privacidad:** qué piezas se miran, cuánto tiempo y
  cuántas pasan a la tienda. Sin datos personales.

## 9. Funciones futuras y su base técnica

| Función | Tecnología | Requisito previo |
|---|---|---|
| "Pruébala en tu casa" (realidad mixta) | WebXR `immersive-ar` + *hit-test* (el navegador del Quest lo soporta) | Modelos a escala real con el origen en la base (Fase 3) |
| Asistente virtual / guía con IA | API de un modelo de lenguaje a través de un **servidor propio** (las claves nunca van en el navegador) + voz (Web Speech API) | Catálogo estructurado (Fase 1) y un backend |
| Visitas compartidas | Networked-A-Frame o WebRTC + un servidor de señalización | Estado de la escena bien separado (Fase 1) |
| Multi-idioma | Archivos de textos por idioma | Textos fuera del HTML (Fase 1) |
