# ArteAnc VR · Santuario contemporáneo

Manual de diseño v1.0 · 7 de noviembre de 2026

## 1. Alcance y criterio de lectura

Propuesta conceptual para una tienda-museo virtual. No es una reproducción de un museo existente ni una reconstrucción arqueológica. Las imágenes se crearon con el generador de imágenes integrado. Todas las piezas, paisajes y precios representados son ejemplos ficticios. No constituyen inventario de ArteAnc, atribuciones culturales, certificaciones ni ofertas de venta.

El plano maestro y el archivo `layout.json` mandan sobre las perspectivas cuando haya diferencias. Las imágenes definen ambiente, composición y materiales; el plano define ubicación y dimensiones. Las medidas son propuestas virtuales, no planos para obra física. Los letreros ARTEANC son tratamientos tipográficos provisionales, no un rediseño aprobado del logotipo.

## 2. Investigación y punto de partida

ArteAnc.com presenta un catálogo de objetos peruanos, con categorías de cerámica, instrumentos, metal, piedra y textiles. Esta variedad justifica una organización por material y experiencia, con atribuciones culturales sólo cuando existan fuentes verificadas. Fuente: https://arteanc.com/ (consulta 07/11/2026).

El repositorio público contiene `index.html`, `app.js`, `catalogo.js` y `modelos/`. El HTML leído utiliza A-Frame 1.8.0, suelo de 12 × 12 m, sala de unos 12 × 9 m, techo a 4,05 m, tres exhibidores y una ficha oculta con nombre, precio, descripción y cierre. Incluye un GLB y selección por ratón y mandos. Se conserva esa lógica de producto seleccionable y ficha única, ampliándola por módulos. Fuentes: https://github.com/oznisosa/arteanc-vr-demo y https://github.com/oznisosa/arteanc-vr-demo/blob/main/index.html.

No se pudo leer el contenido de app.js ni catalogo.js mediante las herramientas usadas. La URL publicada no respondió al lector web. No se evaluaron visualmente la aplicación en ejecución, la compra, las colisiones ni el rendimiento en un visor. Las funciones propuestas en este paquete no deben considerarse ya implementadas.

## 3. Tres direcciones artísticas

### A. Santuario andino contemporáneo

Piedra clara, umbrales de gran profundidad, luz ámbar y piezas aisladas. Identidad: arquitectura vinculada al paisaje sin copiar un monumento ni usar símbolos sagrados como decoración. Compra: cada pieza tiene espacio y un fondo estable. VR: volúmenes sencillos y luz precalculada permiten reducir complejidad. Riesgo: monumentalidad excesiva y largos desplazamientos; se corrige con rutas directas y salas compactas.

### B. Museo digital del patrimonio

Superficies blancas, luz difusa, vitrinas ligeras y curvas continuas. Identidad: contemporánea, pero menos distintiva para ArteAnc. Compra: facilita lectura y comparación de colores. VR: buena legibilidad; cristales superpuestos, reflejos y curvas exigen simplificación. Se adopta su claridad editorial, no sus superficies transparentes extensas.

### C. Historia y futuro

Obsidiana, anillos de bronce y una instalación digital de luz. Identidad: memorable como evento. Compra: el espectáculo puede competir con el producto. VR: transparencias, animaciones y efectos de pantalla elevan el coste. Se reserva para una sala temporal opcional, con animación pausada y versión estática equivalente.

### Dirección recomendada

A como arquitectura, B como disciplina de información, C como exposición futura. La compra permanece serena. La luz tecnológica nunca es el mecanismo principal para encontrar la salida o leer una ficha. Los criterios son juicios de diseño, no resultados de pruebas con usuarios.

## 4. Recorrido y organización

Edificio de una planta con envolvente nominal de 40 × 36 m, unos 1.440 m² brutos virtuales. Plaza exterior adicional de 20 × 8 m. Retícula base de 4 m. Medidas a ejes, con muros interiores nominales de 0,30 m que reducen la superficie útil. El ala oeste mide 12 m, el núcleo 16 m y el ala este 12 m.

Entrada al sur. El vestíbulo ocupa 8 m de fondo; detrás se extiende una banda transversal de circulación de 4 m. La gran galería mide 16 × 16 m. Sus alas se dividen en salas de 12 × 8 m. La banda norte tiene 8 m de fondo. Altura de galería: 7 m; vestíbulo: 4,8 m; alas: 4,2 m. Todo el suelo navegable está en y=0.

Ruta principal: plaza, recepción, galería, sala de cerámica, sala de textiles y sonido, galería, educación, galería, exploración de producto, corredor, compra. Los visitantes pueden saltar salas con el mapa. Ruta de compra rápida: recepción, galería, exploración, compra. El regreso a recepción está siempre disponible desde navegación. Las visitas no requieren completar el contenido educativo.

## 5. Espacios y decisiones concretas

1. **Exterior y fachada.** Volumen horizontal, portal central de 4 m de ancho libre y 4,2 m de alto. Nombre visible con luz rasante. Plaza sin escalones ni vegetación sobre la ruta. Montañas como fondo distante sin colisiones.
2. **Entrada.** Puertas de bronce abiertas durante la visita; umbral a nivel. La galería se percibe desde el vestíbulo. La transición de luz no oscurece la interfaz.
3. **Recepción.** Mostrador de 3,2 × 0,8 m, altura 1 m, con sección baja de 0,75 m. Panel de bienvenida y mapa. El primer botón permite empezar sin tutorial obligatorio.
4. **Gran galería.** Seis piezas destacadas, tres a cada lado, con eje libre de al menos 4 m. El techo enmarca un lucernario longitudinal. El mobiliario final será basalto oscuro incluso donde un render lo muestre claro.
5. **Salas temáticas.** Cerámica y formas en el suroeste de las alas; textiles y sonido al noroeste de las alas. Selección por material en lanzamiento. Culturas específicas sólo mediante curaduría y evidencia verificable. Audio bajo demanda con transcripción.
6. **Exhibidores.** Tres familias compatibles, descritas abajo. La vitrina sirve para presentar objetos pequeños; no impide seleccionar el objeto con el rayo.
7. **Exploración.** Sala este-sur con mesa de giro y una copia del modelo. El objeto original permanece en su lugar. Mostrar escala real o ampliación explícita. Ficha desplazable al lado preferido del usuario.
8. **Compra.** Salón sureste, accesible desde el corredor. Permite revisar selección y continuar en la tienda. No obliga a recorrer físicamente el edificio para comprar.
9. **Educación.** Sala central norte. Breves textos, imágenes con procedencia y narración opcional. Diferenciar información de contexto de los datos específicos de una pieza.
10. **Asistente.** Alcoba suroeste: indicador de voz abstracto y panel de texto. Sin personaje que represente una cultura. Preguntas sugeridas: dónde ir, cómo girar una pieza y cómo comprar. Micrófono sólo tras activación voluntaria.
11. **Circulación.** Banda de 4 m con paso útil mínimo de 3 m y portales interiores de 2,4 m libres. Bancos fuera del paso. Luz de zócalo continua y placas en cada puerta.
12. **Conjunto.** Núcleo central fácil de reconocer. Alas cargadas por proximidad. Archivo de materiales al noroeste y descanso al noreste son extensiones futuras.

## 6. Paleta y materiales

| Token | Color | Uso | Acabado propuesto |
|---|---|---|---|
| stone | #D5C5B0 | Muros | Piedra clara, rugosidad 0,85 |
| ivory | #FFF4E6 | Fichas y lectura | Opaco, sin brillo |
| charcoal | #302A27 | Pedestales y texto | Basalto, rugosidad 0,75 |
| bronze | #795A44 | Marcos y botones | Metal cepillado, rugosidad 0,55 |
| terracotta | #C07746 | Acentos editoriales | Cerámica mate |
| amber | #E8B36C | Luz arquitectónica | Emisión moderada |
| focus | #246F6A | Foco interactivo | Contorno e icono, además del color |

Conservar los tonos piedra y crema que ya aparecen en el HTML existente. El suelo final es mate, con reflejo muy débil. Evitar la apariencia mojada de algunos renders. Mantener normales suaves, juntas amplias y detalle que no produzca centelleo a distancia. No teñir los productos con la iluminación ámbar del edificio: luz de examen neutra y comparación con fotografías verificadas.

Iluminación conceptual: ambiente cálido equivalente a 3000 K; zona de examen neutra equivalente a 4000 K. Son objetivos perceptuales, no mediciones de conservación. Horario visual fijo. Precalcular sombras y rebotes arquitectónicos, reservar iluminación dinámica para el objeto examinado. Evitar bloom, reflejos de pantalla y luz volumétrica en el nivel inicial.

## 7. Tipografía, señalización y mobiliario

Inter para interfaz y señalización, con Noto Sans como alternativa multilingüe; comprobar licencias y cobertura al integrar. En esta entrega se usa Arial por portabilidad. Nombre de sala grande, número de sala y una descripción de una línea. Evitar mayúsculas en párrafos. Español inicial, estructura preparada para inglés. No traducir nombres de culturas de forma automática sin revisión editorial.

Pedestal S: 0,60 × 0,60 × 0,95 m. Pedestal M: 0,90 × 0,90 × 0,75 m. Pedestal L: 1,40 × 1,00 × 0,45 m. Bisel de 10 mm y zócalo retranqueado de 20 mm; no duplicar geometría de detalle invisible. Vitrina: 0,80 × 0,80 × 1,65 m totales, base de 0,75 m y marco de 15 mm. Simular vidrio con el mínimo de caras y reflejos, o usar sólo marco en calidad baja. Mesa de exploración: diámetro 1,60 m, altura 0,75 m. Mantener al menos 1,5 m libres alrededor de puestos interactivos.

## 8. Interfaz espacial

Distancia inicial de lectura: 1,5 a 2 m. Panel típico: 0,95 × 0,62 m. Centro ajustable para uso sentado y de pie, sin forzar altura fija del visor. Texto principal con altura física orientativa de 18 a 24 mm a 1,5 m; títulos de 32 a 40 mm. Botones de al menos 80 × 50 mm con separación de 15 mm. Son hipótesis a validar en Quest 3, no garantías de comodidad.

La ficha queda anclada al puesto, no pegada a la cabeza. Abrir al lado del objeto, aproximadamente a 20 grados del eje visual, con opción de invertir lado. Un solo panel principal abierto. Mapa y carrito se abren mediante acción explícita y tienen cierre visible. Sin selección automática por mirada en el lanzamiento. Feedback mediante contorno, etiqueta y estado presionado.

Ficha: título, condición de ejemplo o naturaleza del producto, fotografía/modelo, dimensiones, material, disponibilidad, precio con moneda, acción de selección y acceso a fuentes. El precio USD 120 de la maqueta es ficticio. No publicar precios de demostración. Estados: cargando, disponible, agotado, error de consulta y sin conexión. Sin datos vigentes, la acción comercial pasa a consultar la tienda.

Examen: girar en ambos sentidos, pausar, ampliar dentro de límites, volver a escala real y restablecer orientación. No iniciar rotación automáticamente. Historia: resumen breve, fuente, fecha de revisión, escuchar/pausar y transcripción. Si no hay fuente, indicar pendiente de verificar sin completar la historia por inferencia.

Bienvenida: explorar, mapa, ayuda, idioma y modo sentado. Navegación: volver a recepción, ir a sala, modo de movimiento y salir de VR. Carrito: unidades, eliminar, subtotal, moneda, aviso de costes de envío/impuestos por confirmar en tienda. Asistente: entrada por texto siempre disponible, micrófono apagado por defecto, escuchando, procesando, respuesta y error. Nunca inventar disponibilidad ni procedencia.

## 9. Comodidad y accesibilidad

Teletransporte como opción inicial, giro por pasos de 30 grados, movimiento continuo opcional con velocidad ajustable. Una malla navegable evita paredes, muebles y bordes. No mover la cámara por animaciones de bienvenida. Modo sentado probado sin agacharse ni alcanzar controles fuera de rango. Subtítulos, volumen, pausa de movimiento decorativo y texto ampliable. Escritorio con ratón, teclado y alternativa de interfaz HTML accesible.

## 10. Fidelidad y revisión

Las perspectivas son ilustraciones de intención: no reproducir cada objeto ni cada luminaria como geometría individual. Corregir las diferencias siguiendo el plano y los tokens. Ningún modelo 3D final se incluye en este paquete. La siguiente iteración necesita inventario real aprobado, fotografías, medidas, modelos licenciados y validación de lectura/movimiento en el visor. Guardar decisiones futuras en CHANGELOG.md, conservando esta versión como referencia.
