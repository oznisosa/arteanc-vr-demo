# Plan maestro — ArteAnc VR

Del prototipo actual a la **versión 1.0 comercial**, y lo que viene después.
Lecturas previas: [DIAGNOSTICO.md](DIAGNOSTICO.md), [VISION.md](VISION.md) y
[ARQUITECTURA.md](ARQUITECTURA.md).

> **Estado al 2026-11-08:** el diseño de la casa está **congelado** en
> [diseno/final/](diseno/final/) (DT-009), con planta, coordenadas y 38
> posiciones de exhibición en `02-layout.json`. **Fase 0 terminada.
> Siguiente paso: Fase 1 (Datos y componentes).**

## Cómo leer este plan

- Cada **fase** tiene un objetivo, entregables, dependencias, criterios de
  finalización y conceptos para estudiar.
- Una fase está **terminada** cuando se cumplen todos sus criterios, se probó
  en PC y en el Quest 3 y tiene su entrada en la [bitácora](BITACORA.md).
- Las fases se dividen en **módulos pequeños** (de unas horas a 2 días), cada
  uno con un resultado visible y un commit propio.
- No hay fechas. El ritmo lo marcan el aprendizaje y la disponibilidad.

## Mapa general

```
 VERSIÓN 1.0 (lanzamiento)
 ─────────────────────────────────────────────────────────────────────
 F0 Cimientos ──▶ F1 Datos y componentes ──┬──▶ F5 Examinar piezas ──┐
                                           │                         │
                  F2 Movimiento y confort ─┤                         ├─▶ F7 Lanzamiento
                                           │                         │
                  F3 Modelos optimizados ──┴──▶ F4 Arquitectura ─────┤
                                                y ambiente           │
                                                F6 Comercio ─────────┘
 DESPUÉS DEL LANZAMIENTO
 ─────────────────────────────────────────────────────────────────────
 v1.1 Idiomas · v1.2 Realidad mixta "en tu casa" · v1.3 Visitas guiadas
 v1.4 Catálogo sincronizado · v2.0 Asistente IA · Experimentos
```

Las fases F2 y F3 pueden avanzar en paralelo a la F1. La F4 necesita las
decisiones de diseño de la [visión](VISION.md) y los datos de las salas (F1).

---

## FASE 0 — Cimientos ✅ (terminada el 2026-11-08)

**Objetivo:** ordenar el proyecto sin cambiar lo que el visitante ve.

| Módulo | Entregable |
|---|---|
| 0.1 Limpieza | ✅ **Hecho el 2026-11-08**: `index - copia.html` y las entregas de diseño originales están en `_archivo/`; los escaneos de prueba, en `_fuentes-3d/` (ambas carpetas ignoradas por Git); `.gitignore` ampliado |
| 0.0 Rama de trabajo | ❌ **Descartado el 2026-11-08** (DT-011): se trabaja en `main`, probando en local antes de cada push |
| 0.2 Node y Vite | ✅ **Hecho el 2026-11-08**: `package.json` con Vite 8.3.6; `npm run dev` levanta un servidor local con recarga automática; `npm run build` genera `dist/` |
| 0.3 Prueba en el Quest | ✅ **Hecho el 2026-11-08**: `npm run quest` (HTTPS por wifi con `@vitejs/plugin-basic-ssl`); Ozni lo probó en el visor y funciona |
| 0.4 Módulos JS | ✅ **Hecho el 2026-11-08**: `app.js` y `catalogo.js` divididos en 8 módulos dentro de `src/` (entrada `src/main.js`) |
| 0.5 Medición | ✅ **Hecho el 2026-11-08**: `?debug` muestra `stats` de A-Frame y un panel propio visible en VR (`medidor-rendimiento`); primera medición en PC registrada. Falta la del Quest |
| 0.6 Publicación | ✅ **Hecho el 2026-11-08**: `.github/workflows/publicar.yml` construye con Vite y publica `dist/` en GitHub Pages en cada push (DT-013); primera publicación en verde |
| 0.7 Lista de pruebas | ✅ **Hecho el 2026-11-08**: [PRUEBAS.md](PRUEBAS.md) con prueba rápida (antes de cada push), prueba completa (PC, Quest, web publicada), problemas conocidos y valores de referencia |

**Dependencias:** ninguna.
**Terminada cuando:** la escena se ve y funciona igual que hoy; se abre con
`npm run dev`; se probó en el Quest 3 desde el servidor local; se publica sola
al hacer push.
**Para estudiar:** terminal y npm · qué es un *bundler* · módulos ES
(`import`/`export`) · HTTPS y por qué WebXR lo exige · `.gitignore`.

---

## FASE 1 — Datos y componentes

**Objetivo:** que agregar una pieza o una sala sea editar datos, no HTML.

| Módulo | Entregable |
|---|---|
| 1.1 Esquema del catálogo | ✅ **Hecho el 2026-11-08**: `datos/catalogo.json` (contrato del diseño final + DT-014), guía [CATALOGO.md](CATALOGO.md), validador `npm run validar`; las 3 piezas migradas |
| 1.2 `pieza-exhibida` | ✅ **Hecho el 2026-11-08**: componente que crea la peana, coloca el modelo de `modelos.galeria` a escala real (`dimensiones_m.alto`) o provisional, y lo hace interactivo; cada pieza es una línea en `index.html` |
| 1.3 `ficha-producto` | ✅ **Hecho el 2026-11-08**: ficha de 0,95 m junto a la pieza, mirando al visitante, con chip de tipo, precio y disponibilidad según el contrato, detalles conocidos y "Sin fuentes verificadas" en el Santuario; crece con el texto |
| 1.4 Datos de salas | ✅ **Hecho el 2026-11-08**: `datos/salas.json` generado desde [02-layout.json](diseno/final/02-layout.json) con `npm run salas` (DT-015): 8 salas, 7 accesos, 38 posiciones, 5 elementos; validador de geometría; guía [SALAS.md](SALAS.md) |
| 1.7 *Greybox* de la casa | ✅ **Hecho el 2026-11-08** en `casa.html` (DT-016): el componente `casa-greybox` levanta toda la casa desde `salas.json` (muros con huecos trapezoidales, portal, hornacinas, soportes, cartelas, canal), fusionada en 13 mallas (~25 llamadas, ~3 600 triángulos). Recorrido de Ozni en el Quest: **90 fps** dentro de VR y "todo perfecto" |
| 1.8 Piezas en la casa | ✅ **Hecho el 2026-11-08**: campo `posicion` en el catálogo (validado contra `salas.json`); `casa.html` monta cada pieza en su posición con `pieza-exhibida` y abre su ficha. Añadido para cerrar la Fase 1 |
| 1.5 Textos y fuente | ✅ **Hecho el 2026-11-08** (DT-017): textos en `datos/textos/es.json` (`t('clave')` y componente `texto`); fuentes MSDF Inter y Cormorant Garamond con tildes y eñes en `fuentes/`; letrero del mostrador girado hacia la galería |
| 1.6 Estado | ✅ **Hecho el 2026-11-08** (DT-018): `src/servicios/estado.js` con pieza seleccionada, favoritos (guardados en `localStorage`) e idioma; avisos de cambios; 9 pruebas automáticas (`npm run probar`) |

**Dependencias:** F0.
**Terminada cuando:** agregar una pieza nueva consiste solo en editar
`catalogo.json` y copiar su modelo; los textos tienen tildes; el HTML de la
escena ocupa menos de 60 líneas; el *greybox* de la casa se recorre en el Quest
y sus medidas coinciden con `02-layout.json`.
**Para estudiar:** JSON · el patrón entidad-componente (ECS) de A-Frame ·
esquema y propiedades de componentes · separar datos y presentación · estado de
la aplicación.

---

## FASE 2 — Movimiento y confort

**Objetivo:** que cualquier persona se mueva sin marearse y sin atravesar paredes.

| Módulo | Entregable |
|---|---|
| 2.1 Teletransporte | Joystick hacia delante para apuntar y soltar para saltar, con un arco y un marcador en el suelo |
| 2.2 Giro por pasos | Joystick derecho para girar 30–45°; el movimiento continuo queda como opción |
| 2.3 Áreas transitables | *Navmesh* o colisiones simples; aplica a VR y a PC |
| 2.4 Altura y modo sentado | Altura calibrable; modo sentado que eleva la vista |
| 2.5 Manos | Seguimiento de manos básico: apuntar y pellizcar para seleccionar |
| 2.6 Escritorio y móvil | Clic en el suelo para desplazarse; controles táctiles básicos |

**Dependencias:** F0 (se puede hacer en paralelo con F1).
**Terminada cuando:** 3 personas que no conocen el proyecto recorren la sala
en el Quest sin mareo ni ayuda, y nadie atraviesa una pared en ninguna plataforma.
**Para estudiar:** confort en VR (vección) · eventos de los controles ·
raycasting · vectores y cuaterniones básicos · *navmesh*.

---

## FASE 3 — Modelos optimizados

**Objetivo:** productos reales que se vean bien y carguen rápido.

| Módulo | Entregable |
|---|---|
| 3.1 Proceso documentado | `docs/PROCESO_MODELOS.md`: de la foto al `.glb` final, paso a paso |
| 3.2 Script de optimización | `npm run optimizar` aplica glTF-Transform a todo lo que esté en una carpeta de entrada |
| 3.3 Primera pieza real | El modelo actual (19 MB) se convierte en versión de galería (≤ 3 MB) y de examen (≤ ~10 MB); la de examen se compara en el Quest con fotos de la pieza real (DT-012) |
| 3.4 Lote inicial | 12–20 productos reales escaneados, limpiados y optimizados |
| 3.5 Carga | Indicador de carga y *placeholder* mientras llega cada modelo |

**Dependencias:** F0. Para el lote inicial, ArteAnc elige los productos.
**Terminada cuando:** todos los modelos cumplen el presupuesto de
[ARQUITECTURA.md](ARQUITECTURA.md) §5 y se ven correctamente en el Quest a
menos de 50 cm.
**Para estudiar:** glTF y sus partes (malla, materiales, texturas) · polígonos
y LOD · compresión de texturas · materiales PBR · fotogrametría.

---

## FASE 4 — Arquitectura y ambiente

**Objetivo:** pasar de "sala de pruebas" a "Casa ArteAnc".

| Módulo | Entregable |
|---|---|
| 4.1 Planta | ✅ **Hecho**: [diseno/final/01-planta.svg](diseno/final/01-planta.svg) (diseño congelado v1.0) |
| 4.2 *Greybox* | Se adelantó a la Fase 1 (módulo 1.7) |
| 4.3 Modelado | Kit arquitectónico de [diseno/final/06-kit.png](diseno/final/06-kit.png) modelado en Blender: muros, accesos trapezoidales, hornacinas, vigas, portal monumental y ranura del Santuario |
| 4.4 Iluminación horneada | Luz y sombras horneadas; mapa de entorno para los reflejos |
| 4.5 Señalética | Puertas y suelos con el color y el motivo de cada sala; nombres de salas |
| 4.6 Sonido | Ambiente por sala y audio espacial |
| 4.7 Recepción | Bienvenida y tutorial de controles de 30 segundos |

**Dependencias:** F1 (salas como datos), F3 (presupuesto de rendimiento), identidad de ArteAnc confirmada.
**Terminada cuando:** el recorrido completo mantiene 72 fps en el Quest; las
pruebas con visitantes confirman que se orientan sin ayuda; ArteAnc aprueba la estética.
**Para estudiar:** escala y proporción · *greyboxing* · iluminación horneada
(*lightmaps*) · materiales · audio espacial.

---

## FASE 5 — Examinar piezas

**Objetivo:** la experiencia central: tener la pieza en las manos.

| Módulo | Entregable |
|---|---|
| 5.1 Agarrar y girar | Con grip o con la mano; al soltar, la pieza vuelve a su sitio con una animación |
| 5.2 Modo inspección (PC/móvil) | Clic en la pieza para orbitar a su alrededor y hacer zoom |
| 5.3 Mesa de examen | Foco de luz rasante movible, lupa y regla de escala |
| 5.4 Escala de referencia | Silueta de una mano o una regla junto a la pieza |

**Dependencias:** F1, F2 (manos), F3 (modelos ligeros).
**Terminada cuando:** se puede tomar, girar y acercar cualquier pieza en las
tres plataformas sin que se pierda ni atraviese objetos.
**Para estudiar:** jerarquía de objetos y cambios de padre (*reparenting*) ·
transformaciones locales y globales · animaciones con interpolación.

---

## FASE 6 — Comercio

**Objetivo:** convertir el interés en una visita a la tienda.

| Módulo | Entregable |
|---|---|
| 6.1 Ver en la tienda | Botón en la ficha que abre `url_tienda` |
| 6.2 Favoritos | Corazón en la ficha; lista visible en el mostrador de cierre |
| 6.3 Llevarse la lista | Enlace o código corto para abrir la lista en el PC o el móvil, o enviarla por correo |
| 6.4 Analítica | Piezas vistas, tiempo y clics a la tienda; sin datos personales; aviso de privacidad |

**Dependencias:** F1. Plataforma de arteanc.com confirmada.
**Terminada cuando:** desde cualquier pieza se llega a su página en
arteanc.com, y la lista de favoritos sobrevive al salir de la VR.
**Para estudiar:** URLs y parámetros · `localStorage` · privacidad y
analítica · embudo de conversión.

---

## FASE 7 — Lanzamiento v1.0

**Objetivo:** publicar con confianza.

| Módulo | Entregable |
|---|---|
| 7.1 Rendimiento | Revisión completa con mediciones en el Quest 3 |
| 7.2 Matriz de pruebas | Quest 3 (controles y manos), Chrome y Edge de escritorio, Safari y Chrome de móvil |
| 7.3 Página de entrada | Página que explica la experiencia, con un botón "Entrar en VR" y requisitos mínimos |
| 7.4 Dominio | Por ejemplo `vr.arteanc.com`, con HTTPS |
| 7.5 Textos legales | Privacidad, aviso sobre el tipo de piezas y la procedencia (revisado por ArteAnc) |
| 7.6 Contenido final | Todas las fichas revisadas: precios, disponibilidad y textos culturales verificados |

**Terminada cuando:** se cumple la definición de la v1.0 (siguiente sección).

### Definición de la versión 1.0
- Recepción, patio y al menos 2 salas temáticas.
- 12–20 productos reales optimizados, con ficha completa y enlace a la tienda.
- Teletransporte, giro por pasos, modo sentado y sin atravesar paredes.
- Piezas que se pueden tomar y examinar.
- Favoritos que se pueden llevar fuera de la VR.
- 72 fps estables en el Quest 3; carga inicial de menos de 8 s.
- Funciona en el navegador del Quest 3 y en Chrome de escritorio; en móvil, como mínimo en modo visor.
- Textos en español con ortografía correcta.

---

## DESPUÉS DEL LANZAMIENTO (mejoras importantes)

| Versión | Mejora | Valor |
|---|---|---|
| v1.1 | **Inglés** (y otros idiomas) | Clientes internacionales; la estructura ya estará lista desde F1 |
| v1.2 | **"Pruébala en tu casa"** con realidad mixta en el Quest 3 | Diferenciador comercial fuerte |
| v1.3 | **Visitas guiadas** con narración y recorridos temáticos | Educación y permanencia |
| v1.4 | **Catálogo sincronizado** con arteanc.com | Sin mantener datos dos veces |
| v1.5 | **Pieza de la semana** y exposiciones temporales | Motivo para volver |
| v1.6 | **Línea de tiempo caminable** de las culturas andinas | Educación |
| v2.0 | **Asistente / guía con IA** que responde preguntas sobre las piezas a partir del catálogo | Atención personalizada |

## EXPERIMENTOS AMBICIOSOS (futuro)

- **Visita con un vendedor en tiempo real** (sesión compartida con voz).
- **Exposiciones de artesanos invitados**: sala propia para un artesano, con su
  historia y su taller escaneado.
- **Gaussian splatting**: captura fotorrealista de espacios o piezas difíciles
  (textiles, metal brillante) donde la fotogrametría clásica falla.
- **Taller virtual**: ver cómo se hace una pieza (torno, telar), paso a paso.
- **WebGPU**, cuando el navegador del Quest lo soporte bien: más calidad gráfica.
- **App nativa** en Meta Store como versión "premium", si la web se queda corta.

---

## Preguntas abiertas para ArteAnc

Estas respuestas afectan al plan; conviene tenerlas antes de las fases indicadas.

| # | Pregunta | Afecta a |
|---|---|---|
| 1 | ¿En qué plataforma está arteanc.com (Shopify, WooCommerce u otra)? | F6, v1.4 |
| 2 | 🟡 Provisional (DT-014): Santuario como originales antiguos y demás salas como artesanía tradicional peruana; se afinará. **Falta revisión legal** de la venta de piezas precolombinas originales | F7 (legal) |
| 3 | ✅ Resuelto en el diseño final: Cerámica, Textiles, Metal/piedra/instrumentos y Santuario precolombino | — |
| 4 | ¿Hay logo oficial? (La paleta y la tipografía ya están propuestas en `diseno/final/DISENO_FINAL.md` §4 y §7) | F4 |
| 5 | ¿Qué 12–20 productos irán en la v1.0? | F3 |
| 6 | ¿Qué idiomas hacen falta y en qué orden? | F1, v1.1 |
| 7 | ¿Se usará un dominio propio (p. ej. `vr.arteanc.com`)? | F7 |

## Aprendizaje

Al terminar cada fase:
1. Se agrega una entrada a la [bitácora](BITACORA.md) con lo construido, los
   conceptos y ejercicios propuestos.
2. Las decisiones técnicas importantes se registran en [DECISIONES.md](DECISIONES.md).
3. ChatGPT revisa los cambios en GitHub y propone el estudio. Cuando exista,
   `docs/PERFIL_APRENDIZAJE.md` servirá para ajustar las explicaciones al nivel real.
