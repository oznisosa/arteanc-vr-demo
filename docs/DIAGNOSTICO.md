# Diagnóstico del prototipo — ArteAnc VR

Estado del proyecto al **7 de noviembre de 2026** (commit `f29311a`).
Las coordenadas detalladas de cada elemento están en [MAPA_ESCENA.md](MAPA_ESCENA.md).

## Resumen

El prototipo **funciona** y demuestra lo esencial: una sala navegable, piezas
sobre pedestales, una ficha de producto, puertas animadas, una recepción y
movimiento con joystick en Quest 3. Es una buena prueba de concepto, pero está
construido como un único documento HTML con valores escritos a mano.
Agregar cada pieza o sala nueva cuesta cada vez más y es más fácil romper algo.

Antes de crecer, el proyecto necesita **cimientos**: separar los datos de la
escena, convertir los patrones repetidos en componentes y crear un proceso
para optimizar los modelos 3D.

## Qué existe hoy

| Área | Estado | Archivo |
|---|---|---|
| Motor | A-Frame 1.8.0 desde CDN, sin herramientas de compilación | `index.html` |
| Sala | Una sola sala de 12 × 9 m, techo a 4 m, con paredes, techo, suelo y baldosas generadas | `index.html`, `app.js` |
| Piezas | 3 pedestales: una esfera, un cono y un modelo 3D real (fotogrametría, 19 MB) | `index.html` |
| Catálogo | 3 entradas (nombre, precio, descripción) en un objeto global | `catalogo.js` |
| Ficha | Un único panel compartido que se rellena al hacer clic en una pieza | `index.html`, `app.js` |
| Recepción | Mostrador con letrero de bienvenida que se muestra u oculta | `index.html`, `app.js` |
| Puertas | Puertas corredizas con botones a ambos lados | `index.html`, `app.js` |
| Movimiento VR | Joystick izquierdo con movimiento continuo y límites rectangulares | `app.js` (`caminar-quest`) |
| Movimiento PC | WASD y ratón (comportamiento por defecto de A-Frame) | — |
| Despliegue | Repositorio `oznisosa/arteanc-vr-demo` en GitHub; parece publicado con GitHub Pages (por confirmar) | — |

## Fortalezas

- **Funciona en el navegador del Quest 3** sin instalar nada. Basta un enlace.
  Es una ventaja comercial enorme frente a una app de tienda.
- **Ya se trabaja con fotogrametría** (RealityScan/RealityCapture, según los
  archivos `.rsInfo`). Es el camino correcto para mostrar productos reales.
- **El código es legible** y está comentado en español. Funciona bien como
  material de aprendizaje.
- **Hay un componente propio** (`caminar-quest`), que es el patrón correcto en A-Frame.
- **Se usa Git** con commits pequeños y descriptivos.

## Problemas encontrados

### Arquitectura del código
1. **Todo está en un solo HTML.** Las paredes, los paneles, las piezas y la UI son bloques
   copiados con números escritos a mano. Para mover la sala hay que editar decenas
   de coordenadas.
2. **Los datos están mezclados con la escena.** Las piezas se declaran en el HTML
   y sus datos en `catalogo.js`; el `id` es lo único que los une. Agregar un
   producto exige tocar dos archivos y calcular posiciones.
3. **El código de `app.js` es procedimental.** Usa `querySelector` y listeners
   sueltos en lugar de componentes reutilizables (salvo `caminar-quest`).
4. **No hay módulos ni dependencias gestionadas.** A-Frame llega desde un CDN y
   no hay `package.json`.

### Modelos 3D
5. **Los modelos son demasiado pesados para la web.** El único modelo usado pesa
   19 MB y hay variantes de 38 MB sin usar. En el Quest 3, un modelo así tarda en
   descargarse, ocupa mucha memoria y puede bajar los fotogramas por segundo.
   Una pieza optimizada debería pesar alrededor de 1–3 MB.
6. **No hay un proceso de optimización** (reducción de polígonos, compresión de
   geometría y texturas).
7. **Los archivos fuente se mezclan con los publicados.** Hay más de 200 MB de
   pruebas en `modelos/`. Git no es buen lugar para binarios grandes que
   cambian a menudo.

### Experiencia en VR
8. **La locomoción solo es continua.** Moverse con el joystick sin teletransporte ni giro
   por pasos (*snap turn*) marea a muchas personas.
9. **No hay colisiones reales.** En VR hay un rectángulo de límites; en PC se
   atraviesan las paredes.
10. **Las piezas no se pueden examinar.** Solo se ven sobre el pedestal; no se pueden
    tomar, girar ni ampliar. Para quien compra arte, examinar es lo más importante.
11. **La ficha es enorme y está lejos.** Mide 2.8 m de ancho, flota a 2.35 m de
    altura y es una sola para todas las piezas. Tapa la exposición.
12. **Los textos no llevan tildes ni eñes** ("galeria", "CERAMICA"). La fuente por
    defecto de A-Frame no tiene esos caracteres, así que hace falta una fuente
    MSDF propia con soporte para español.
13. **Hay textos que miran al revés.** El letrero "ARTEANC" del mostrador no es
    visible desde la galería.

### Diseño espacial
14. **Los pedestales tienen un tamaño poco realista.** Miden 1.3 m de diámetro para
    piezas de 30–70 cm. En los museos se usan peanas de 40–60 cm.
15. **La iluminación es plana.** Solo hay luz ambiental, una direccional y una
    puntual, sin sombras ni materiales realistas. Todo se ve como plástico.
16. **Los paneles de la pared están vacíos**, y la entrada y las puertas no
    conducen a ningún lugar.
17. **No hay identidad visual andina**: ni arquitectura, ni materiales, ni motivos,
    ni sonido.

### Comercio y contenido
18. **No hay enlace a la tienda.** No se puede pasar de "me gusta" a "comprar".
19. **El catálogo no tiene la información que un comprador de arte necesita**:
    cultura, época, material, dimensiones, procedencia y tipo de pieza
    (original, réplica o artesanía contemporánea).

## Conclusión

No hace falta empezar de cero. A-Frame sigue siendo una buena base (ver
[ARQUITECTURA.md](ARQUITECTURA.md)). Lo que hace falta es **reorganizar antes de
ampliar**: primero los datos, los componentes y los modelos optimizados, y
después las salas y las funciones nuevas. Ese orden está en
[PLAN_MAESTRO.md](PLAN_MAESTRO.md).
