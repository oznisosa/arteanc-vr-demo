# Registro de decisiones técnicas — ArteAnc VR

Cada decisión importante se anota aquí con su contexto, para que en el futuro
se entienda **por qué** se hizo algo así y cuándo convendría cambiarlo.

**Estados:** `Propuesta` (pendiente de aprobación) · `Aceptada` · `Reemplazada por DT-XXX` · `Descartada`.

**Formato:** contexto → decisión → alternativas → consecuencias → cuándo revisarla.

---

## DT-001 — Seguir con A-Frame para la versión 1.0
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** el prototipo usa A-Frame 1.8.0. Se planteó si convenía cambiar
de tecnología antes de crecer.

**Decisión:** seguir con A-Frame y reorganizar el proyecto (datos, componentes,
proceso de modelos).

**Alternativas:** Three.js puro, React Three Fiber, Babylon.js, PlayCanvas,
Needle Engine, app nativa en Unity. Comparativa en [ARQUITECTURA.md](ARQUITECTURA.md) §2.

**Consecuencias:** se conserva lo construido y la curva de aprendizaje suave;
hay que imponer orden (componentes y datos) para que el proyecto escale.

**Revisar si:** con modelos optimizados no se alcanzan 72 fps, o se necesita
un editor visual en equipo, o una función clave no tiene solución madura.

---

## DT-002 — La escena se construye a partir de datos (JSON)
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** las piezas se declaran en el HTML con coordenadas escritas a mano
y sus datos viven aparte en `catalogo.js`.

**Decisión:** el catálogo, las salas y los textos pasan a archivos JSON. Unos
componentes leen esos datos y crean las entidades.

**Alternativas:** seguir escribiendo HTML a mano (no escala) o usar un CMS ya
(prematuro).

**Consecuencias:** agregar una pieza es editar datos; se facilitan la
traducción y la futura sincronización con la tienda. Requiere aprender
JSON y la carga de datos asíncrona.

---

## DT-003 — Introducir Node.js y Vite en la Fase 0
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** el proyecto no tiene herramientas de compilación. Para probar en
el Quest hace falta HTTPS; los scripts de optimización de modelos necesitan
Node.js de todos modos.

**Decisión:** usar Vite como servidor de desarrollo y empaquetador.

**Alternativas:** seguir sin herramientas usando módulos ES nativos y el
servidor de Python (más simple, pero sin HTTPS fácil ni optimización al
publicar); otros empaquetadores como webpack (más complejos).

**Consecuencias:** aparecen `package.json` y `node_modules/`, y hay que aprender
npm. A cambio se obtienen recarga automática, HTTPS local y una publicación optimizada.

---

## DT-004 — La compra se completa en arteanc.com
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** procesar pagos dentro de la VR implica seguridad, impuestos,
envíos y aduanas, que la tienda ya resuelve.

**Decisión:** la VR es escaparate y sala de examen. La ficha enlaza a la página
del producto en arteanc.com, y los favoritos se pueden llevar fuera de la VR.

**Consecuencias:** sin riesgo con los pagos. Hay que diseñar bien la
transición (en el Quest, abrir un enlace saca de la VR).

**Revisar si:** la plataforma de la tienda ofrece una API de carrito fiable y
los datos muestran que los visitantes abandonan al salir de la VR.

---

## DT-005 — Arquitectura modelada en Blender con iluminación horneada
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** las primitivas de A-Frame con luces dinámicas se ven planas,
y muchas luces dinámicas son caras en el Quest.

**Decisión:** a partir de la Fase 4, la arquitectura se modela en Blender, se
hornea su iluminación en texturas y se exporta como `.glb`. A-Frame solo se
encarga de la interacción y de las piezas.

**Consecuencias:** gran mejora visual con bajo coste de rendimiento. Exige
aprender Blender, y cambiar la luz requiere volver a hornear.

---

## DT-006 — Proceso obligatorio de optimización de modelos
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** el modelo actual pesa 19 MB y los escaneos originales, 38 MB.

**Decisión:** todo modelo pasa por limpieza en Blender y glTF-Transform antes
de publicarse, y debe cumplir el presupuesto de [ARQUITECTURA.md](ARQUITECTURA.md) §5.
El origen va en la base de la pieza y la escala, en metros reales.

**Consecuencias:** carga rápida y fps estables; un paso más en la producción de cada pieza.

**Matizada por DT-012:** optimizar nunca debe hacer que la pieza se vea distinta de la real.

---

## DT-007 — Los archivos 3D fuente no se guardan en Git
**Estado:** Aceptada (aprobada por Ozni el 2026-11-08) · **Fecha:** 2026-11-07

**Contexto:** hay más de 200 MB de escaneos de prueba en `modelos/`. Git guarda
cada versión de cada binario para siempre, y el repositorio crecería sin control.

**Decisión:** en Git solo se guardan los modelos optimizados. Los originales
(`.glb` densos, `.blend`, fotos) van a una carpeta fuera del repositorio con
copia de seguridad (disco externo o nube).

**Alternativas:** Git LFS (tiene cuotas de almacenamiento en GitHub).

**Consecuencias:** repositorio ligero; hay que mantener la copia de seguridad de las fuentes aparte.

---

## DT-008 — Diseño combinado: "La Casa ArteAnc" + Santuario precolombino
**Estado:** Aceptada · **Fecha:** 2026-11-07

**Contexto:** ChatGPT generó dos propuestas visuales. El **Prototipo 1**
("Santuario andino contemporáneo", 40 × 36 m) tiene mucho impacto, pero es
grande y difícil de construir en el Quest. El **Prototipo 2** ("La Casa ArteAnc",
~28 × 26 m) es coherente, compacto y modular, aunque menos impactante.

**Decisión:** el Prototipo 2 es la base (patio, kit, colores e interfaz). El
concepto A del Prototipo 1 se convierte en una sala única, el **Santuario
precolombino**, situada en el eje norte como remate del recorrido. Del
Prototipo 1 se conservan además el contrato de datos, los estados de la ficha
y las pruebas de aceptación. Se eliminan las hojas de puerta.

**Consecuencias:** se encargó un diseño final congelado
([PROMPT_DISENO_FINAL.md](diseno/encargos/PROMPT_DISENO_FINAL.md)) que será la
referencia única para construir.

---

## DT-009 — Diseño final congelado v1.0 como referencia de construcción
**Estado:** Aceptada · **Fecha:** 2026-11-08

**Contexto:** ChatGPT entregó el diseño combinado. Claude lo revisó: salas sin
solapes, 0,40 m de muro entre salas vecinas, accesos centrados en sus muros y
las 38 posiciones de exhibición dentro de su sala o de su muro (las hornacinas).

**Decisión:** [diseno/final/](diseno/final/) es la referencia única.
`02-layout.json` y `01-planta.svg` mandan sobre las imágenes. Se aceptan las
resoluciones que tomó el diseñador:
- la **galería sur abierta** de 2 m, para dar acceso propio a las tres salas del sur;
- la recepción sin piezas;
- **6 piezas** en las salas Metal y Taller;
- el origen `(0,0,0)` en el umbral sur, con norte = −Z.

**Consecuencias:** las salas de `datos/salas.json` (Fase 1) salen de este JSON.
Ojo: en este diseño `rooms.size` son **medidas libres interiores** (no a ejes
de muro), así que el constructor **no** debe restar otra vez el grosor del
muro. Cualquier cambio futuro se publica como v1.1, v1.2… y se registra aquí.

---

## DT-010 — Presupuesto de rendimiento unificado
**Estado:** Aceptada · **Fecha:** 2026-11-08

**Decisión:** de nuestro plan y del diseño final se toma el valor más estricto:
- menos de 100 llamadas de dibujo (alarma a partir de 150);
- 250 000 triángulos visibles por vista;
- 20 MB de descarga inicial y 256 MB de texturas;
- dos versiones de cada pieza: galería (5–15 mil triángulos) y examen (30–60 mil).

Detalle en [ARQUITECTURA.md](ARQUITECTURA.md) §5. Se valida midiendo en el Quest 3.

---

## DT-011 — Se trabaja directamente en la rama `main`
**Estado:** Aceptada · **Fecha:** 2026-11-08

**Contexto:** el plan proponía una rama por fase (`fase-0`, `fase-1`…) porque
GitHub Pages publica la web desde `main`. Ozni prefiere trabajar solo en `main`
para que el flujo sea más simple mientras aprende Git.

**Decisión:** todo se hace en `main`. Se descarta el módulo 0.0.

**Regla que lo compensa:** antes de cada `push`, la escena se prueba en local
(clics, ficha, puertas, movimiento) y debe verse igual o mejor que antes. Un
cambio a medias se guarda con commit local, pero no se sube hasta que funcione.

**Alternativas:** una rama por fase (más segura, un concepto más que aprender).

**Consecuencias:** flujo más sencillo; un error subido rompe la web pública
hasta que se corrija (se puede deshacer con `git revert`).

**Revisar si:** la web publicada se rompe más de una vez, o si empiezan a
visitarla clientes reales.

---

## DT-012 — La fidelidad visual de las piezas tiene prioridad
**Estado:** Aceptada · **Fecha:** 2026-11-08

**Contexto:** al aprobar DT-006, Ozni recordó que en la VR se presentan
artesanías y artefactos que **se venden**: el comprador debe ver la pieza tal
cual es (color, textura, desgaste, marcas). Optimizar no puede costar fidelidad.

**Decisión:** cada pieza tiene dos versiones con objetivos distintos:
- **Galería** (la que está en la peana, vista a 1–3 m y junto a muchas otras):
  ligera, ≤ 3 MB, textura de 2048 px. Aquí el presupuesto manda.
- **Examen** (la que se carga **solo** cuando el visitante toma o examina esa
  pieza, una a la vez): aquí **manda la fidelidad**. Hasta ~10 MB, textura de
  hasta 4096 px y hasta ~100 000 triángulos. Se descarga al soltarla.

Además, el detalle fino del escaneo denso (relieves, grietas, trama del
tejido) se conserva en un **mapa de normales**, y el color se calibra con las
fotos de referencia.

**Criterio de aceptación de cada pieza:** comparar en el Quest, a menos de
50 cm, la versión de examen con fotos de la pieza real. Si Ozni nota una
diferencia que un comprador notaría, la pieza no se publica.

**Alternativas:** una sola versión ligera (rápida, pero pierde detalle) o una
sola versión pesada (fiel, pero 20 piezas así harían la carga lenta y bajarían los fps).

**Consecuencias:** un poco más de trabajo por pieza (dos exportaciones). Los
valores de la versión de examen son iniciales y se validan en el módulo 3.3
midiendo en el Quest.

---

## DT-013 — Publicar con GitHub Actions (build de Vite) en lugar de la rama
**Estado:** Aceptada · **Fecha:** 2026-11-08

> **Historia:** primero se aplazó (commit `3f4a8cf`) porque hoy la ventaja es
> pequeña. Al saber que hará falta en cuanto la escena use paquetes de npm
> (teletransporte en F2, descompresor de modelos en F3), Ozni decidió
> activarla ya, para que la base quede lista.

**Contexto:** GitHub Pages publicaba la raíz de `main` tal cual ("Deploy from
a branch"). Funcionaba, pero publicaba también `docs/` (≈ 10 MB de diseño),
`package.json`, etc., y el código sin optimizar.

**Decisión:** un flujo de GitHub Actions (`.github/workflows/publicar.yml`)
ejecuta `npm ci` y `npm run build` en cada push a `main` y publica solo `dist/`.

**Alternativas:** seguir publicando la rama (más simple, pero sin build);
Netlify o Vercel (más funciones, otra cuenta que mantener).

**Consecuencias:** se publica solo lo necesario y optimizado; el paso de build
queda registrado en la pestaña Actions (si falla, no se publica y la web
anterior sigue en pie). Requiere cambiar una vez Settings → Pages → Source.

**Revisar si:** se necesita un dominio propio con funciones de servidor (F7).

---

## DT-014 — Tipos de pieza por sala y nuevo tipo `artesania_tradicional`
**Estado:** Aceptada · **Fecha:** 2026-11-08

**Contexto:** el diseño final define `original_documentado`, `replica`,
`artesania_contemporanea` y `null`, y en sus maquetas usa "Réplica" en el
Santuario y "Artesanía contemporánea" en las demás salas. Ozni pidió que las
piezas del Santuario se presenten **como antiguas** y las demás **como
artesanías tradicionales peruanas**, y que más adelante lo afinará (es una
cuestión de marketing que se investigará).

**Decisión:**
- Se añade el valor `artesania_tradicional` → "Artesanía tradicional peruana".
- Demo: Santuario = `original_documentado`; resto = `artesania_tradicional`;
  todo con `tipoPiezaEsIlustrativo: true`.
- Se amplía el contrato con `id`, `descripcion`, `sala`, `cultura`, `epoca`
  y `procedencia` (guía en [CATALOGO.md](CATALOGO.md)).
- `npm run validar` comprueba el catálogo y se ejecuta antes de cada build.

**Aviso:** los bienes arqueológicos prehispánicos son Patrimonio Cultural de
la Nación en el Perú (Ley 28296), con restricciones de comercio y
exportación. Vender piezas `original_documentado` requiere una revisión
legal (módulo 7.5). La regla del diseño se mantiene: ese tipo exige
documentación de **cada pieza**; el nombre de la sala no basta.

**Revisar:** cuando ArteAnc confirme qué vende realmente (pregunta abierta n.º 2).
