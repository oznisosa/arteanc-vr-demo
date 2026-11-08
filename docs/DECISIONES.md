# Registro de decisiones técnicas — ArteAnc VR

Cada decisión importante se anota aquí con su contexto, para que en el futuro
se entienda **por qué** se hizo algo así y cuándo convendría cambiarlo.

**Estados:** `Propuesta` (pendiente de aprobación) · `Aceptada` · `Reemplazada por DT-XXX` · `Descartada`.

**Formato:** contexto → decisión → alternativas → consecuencias → cuándo revisarla.

---

## DT-001 — Seguir con A-Frame para la versión 1.0
**Estado:** Propuesta · **Fecha:** 2026-11-07

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
**Estado:** Propuesta · **Fecha:** 2026-11-07

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
**Estado:** Propuesta · **Fecha:** 2026-11-07

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
**Estado:** Propuesta · **Fecha:** 2026-11-07

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
**Estado:** Propuesta · **Fecha:** 2026-11-07

**Contexto:** las primitivas de A-Frame con luces dinámicas se ven planas,
y muchas luces dinámicas son caras en el Quest.

**Decisión:** a partir de la Fase 4, la arquitectura se modela en Blender, se
hornea su iluminación en texturas y se exporta como `.glb`. A-Frame solo se
encarga de la interacción y de las piezas.

**Consecuencias:** gran mejora visual con bajo coste de rendimiento. Exige
aprender Blender, y cambiar la luz requiere volver a hornear.

---

## DT-006 — Proceso obligatorio de optimización de modelos
**Estado:** Propuesta · **Fecha:** 2026-11-07

**Contexto:** el modelo actual pesa 19 MB y los escaneos originales, 38 MB.

**Decisión:** todo modelo pasa por limpieza en Blender y glTF-Transform antes
de publicarse, y debe cumplir el presupuesto de [ARQUITECTURA.md](ARQUITECTURA.md) §5.
El origen va en la base de la pieza y la escala, en metros reales.

**Consecuencias:** carga rápida y fps estables; un paso más en la producción de cada pieza.

---

## DT-007 — Los archivos 3D fuente no se guardan en Git
**Estado:** Propuesta · **Fecha:** 2026-11-07

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
