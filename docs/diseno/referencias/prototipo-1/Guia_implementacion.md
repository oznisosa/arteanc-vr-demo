# ArteAnc VR · Guía de implementación

Versión 1.0 · Propuesta para Claude Code · 07/11/2026

## 1. Punto de entrada

Leer primero README.md, Manual_diseno.md y layout.json. El código de la tienda no fue modificado. No reemplazar el proyecto completo a partir de un render. Revisar el repositorio y fijar un commit de referencia antes de construir; esta entrega inspeccionó la rama main, sin fijar SHA. A-Frame 1.8.0 está declarado en el HTML observado. Inspeccionar app.js y catalogo.js antes de asignarles responsabilidades nuevas.

## 2. Arquitectura propuesta

Separar escena, catálogo, interacción y comercio. Mantener A-Frame como capa de escena. Usar componentes con init, update y remove, y liberar listeners, geometrías y texturas al abandonar una sala. No crear objetos temporales por fotograma. El estado del carrito no pertenece a una entidad 3D que pueda descargarse.

| Componente propuesto | Responsabilidad | Criterio de aceptación |
|---|---|---|
| room-loader | Carga sala actual y vecinas | Una sala descargada libera recursos propios |
| museum-navigation | Teletransporte y mapa | No cruza muros ni aterriza sobre exhibidores |
| exhibit-slot | Relaciona pedestal y SKU | No muestra precio sin identidad válida |
| product-inspector | Copia de examen y controles | Restablece orientación y escala exactas |
| spatial-panel | Foco, cierre y posición | Un solo panel principal, lectura sentado |
| catalog-adapter | Datos de productos | Distingue ausente, cargando, agotado y error |
| selection-store | Selección persistente de SKU | Evita duplicados si el stock es unitario |
| commerce-handoff | Paso explícito a tienda | Permite cancelar y volver al museo |
| content-card | Historia y sus fuentes | Sin fuente no inventa atribución |
| guide-panel | Ayuda y consulta opcional | Texto funcional aunque falle voz/IA |

Eventos propuestos: product-selected con sku; inspector-opened con sku; selection-changed con lista de sku y cantidad; room-requested con roomId; commerce-requested con selección; catalog-error con motivo. El sistema de comercio vuelve a verificar precio y stock. Evitar credenciales o claves privadas en JavaScript público.

## 3. Contrato de datos

`producto_ejemplo.json` contiene un registro de demostración separado de producción. Campos mínimos: sku, titulo, naturaleza, material, dimensiones en metros, fuentes, estado editorial, moneda, precio, stock, urlProducto, modelos por LOD y fecha de actualización. null significa desconocido, no cero. Guardar si una escala es real o normalizada. Un modelo normalizado no autoriza publicar medidas.

Para producción, la tienda es la autoridad comercial. No se verificó su API ni la plataforma del carrito. Primera entrega comercial: abrir la página real verificada de cada producto mediante acción explícita. Un carrito sincronizado requiere validar API, sesiones, restricciones de origen y manejo de errores. No asumir que añadir a una lista local añade a la cesta del sitio.

Al continuar desde XR: conservar selección, explicar que se abrirá la tienda y ofrecer cancelar. Probar la apertura con gesto del usuario y salida de sesión XR cuando corresponda. Si el navegador bloquea la ventana, mostrar enlace seleccionable fuera de XR y recuperar la selección al volver. QR sólo como alternativa de uso en un segundo dispositivo, no como única vía.

## 4. Modelado y coordenadas

Una unidad equivale a un metro. Eje Y vertical. El acceso sur está en z=0 y el edificio se extiende hacia z negativo hasta -36. X va de -20 a 20. layout.json contiene centros, tamaños nominales y conexiones. Conservar un origen de exportación por módulo y transformaciones aplicadas. Muros de 0,30 m centrados en ejes; recortar suelo navegable considerando espesores y mobiliario. El plano no certifica evacuación ni construcción física.

Kit: muro 4 m, esquina, portal 2,4 m, portal de fachada 4 m, panel ciego, lucernario, banco, zócalo, tres pedestales y vitrina. Exportar GLB en metros con pivote al centro de la base, normales revisadas y caja de colisión simplificada. Usar Blender para modelado, UV y horneado. No importar modelos externos sin revisar licencia, escala y procedencia. No se seleccionó un activo de terceros como listo para producción.

Para cada pieza: fotografías verificadas, dimensiones, malla optimizada, texturas, LOD y miniatura. Objetivo inicial orientativo: LOD de galería 5–15 mil triángulos y examen 30–60 mil, según silueta. Las piezas pequeñas de fondo usan representación de menor detalle. Un solo objeto en detalle alto por vez. No dar forma histórica a una pieza por extrapolación de IA.

## 5. Presupuesto visual inicial

Los siguientes valores son límites internos de partida, NO resultados medidos ni especificaciones oficiales del visor. Ajustarlos con perfiles reales. Objetivo base: 72 Hz sostenidos, presupuesto de 13,9 ms por fotograma. Aspiración posterior: 90 Hz, 11,1 ms. La frecuencia efectiva depende de la sesión y el navegador.

Objetivo por vista: hasta 150 draw calls y 250 mil triángulos visibles; texturas residentes objetivo de 256 MB; descarga inicial objetivo de 20 MB o menos. Son alarmas para investigar, no garantías de rendimiento. Incluir la escena, UI y objeto de examen al medir. Distinguir tamaño de descarga, memoria GPU y memoria JavaScript.

Texturas arquitectónicas de 1K compartidas, 2K sólo donde aporte detalle cercano. KTX2/Basis cuando el cargador esté configurado y probado. Decodificadores y rutas deben estar disponibles en el despliegue. Precalcular iluminación, limitar luces dinámicas y evitar sombras en tiempo real en calidad base. No activar PBR complejo en todos los elementos. Atlas y geometría combinada por sala; no fusionar todo el edificio porque impediría descargarlo por zonas.

El frustum culling no resuelve toda la oclusión entre salas: cargar por sala y adyacencia, descargar activos lejanos y probar umbrales para evitar apariciones bruscas. Evitar partículas transparentes, vidrio de varias capas y superficies de alta cobertura con blending. Cualquier efecto C se activa de forma aislada y tiene sustituto estático. Raycasters restringidos a interactivos, no a toda la escena.

## 6. Progresión de entregas

### Fase 0 · Base verificable

Auditar scripts actuales, confirmar licencia de modelos y registrar captura del prototipo. Construir greybox según plano con un producto de prueba no vendible. Salida: distancias, portales, retorno a recepción y prueba sentado/de pie aprobados. No producir todas las texturas antes de esta revisión.

### Fase 1 · Lanzamiento esencial

Construir fachada simplificada, recepción, galería, una sala temática, examen y selección comercial con enlace verificado a producto. Asistente mediante ayuda escrita, sin dependencia de IA. Habilitar ficha con estado de disponibilidad, mapa, teletransporte, controles de escritorio, subtítulos y ajustes. Las salas futuras se cierran con una puerta y un letrero claro; no cargar espacios vacíos.

Salida: visitante localiza una pieza, la examina, entiende si está disponible y abre su página de compra. La visita funciona si falla catálogo, modelo o audio. Medición sostenida en Quest 3 tras 15 minutos. La compra no se declara completada sin confirmación del sitio.

### Fase 2 · Museo ampliado

Añadir segunda sala temática, educación con fuentes revisadas, archivo y contenidos en inglés. Integrar selección múltiple con el comercio sólo después de validar el contrato. Añadir modos de calidad y precarga de salas vecinas. Salida: recorrido completo sin saltos perceptibles y fuentes visibles en cada ficha educativa.

### Fase 3 · Experiencias especiales

Instalación digital derivada del concepto C, asistente con recuperación sobre contenidos aprobados, voz opcional y exposiciones temporales. Multijugador, visitas guiadas sincronizadas y captura 3D de todo el catálogo requieren proyectos separados. No condicionan el lanzamiento.

## 7. Pruebas de aceptación

- Quest 3 real con navegador y versión de sistema registrados; medir escena vacía, galería llena, panel abierto y carga de sala. Usar estadísticas y perfiles para identificar CPU/GPU. Registrar fotogramas lentos y memoria, no sólo media de FPS.
- Recorrido continuo de 15 minutos: sin aumento sostenido de memoria al entrar y salir de salas, sin colisiones fallidas ni pérdida de selección.
- Sentado y de pie: leer y activar todas las acciones sin alcance forzado. Revisar tamaño angular y contraste dentro del visor.
- Escritorio: teclado, ratón, foco visible, Escape para cerrar panel y alternativa HTML accesible. No capturar atajos del navegador innecesariamente.
- Datos: probar precio nulo, agotado, cambio de stock, error de red, texto largo y modelo ausente. Nunca sustituir un dato desconocido por uno plausible.
- Comercio: cancelar salida, ventana bloqueada, vuelta a VR y selección persistente. Sin doble incorporación accidental al pulsar repetidamente.
- Contenido: ninguna afirmación cultural sin fuente editorial aprobada. La ayuda reconoce los límites de la información disponible.

## 8. Instrucción inicial para Claude Code

Lee README.md, Manual_diseno.md, Guia_implementacion.md y layout.json. Audita el repositorio existente y resume qué funciones están presentes antes de cambiarlo. Implementa únicamente la Fase 0 en una rama nueva, conservando catálogo y activos existentes. Usa las coordenadas del plano y una pieza de demostración marcada como no vendible. No interpretes los renders como geometría exacta. Entrega una comparación del recorrido actual y propuesto, instrucciones de prueba y métricas realmente medidas. No integres pagos ni inventes contenido histórico. Tras validar la escala, continúa con la Fase 1 por componentes.

## 9. Fuentes técnicas

Consultadas el 07/11/2026. Verificar de nuevo las API al desarrollar.

- A-Frame, prácticas: https://aframe.io/docs/1.7.0/introduction/best-practices.html (documentación de versión anterior; se usan principios de componentes, menos entidades, iluminación horneada y raycasters acotados, no ejemplos antiguos de API de texturas).
- A-Frame actual: https://aframe.io/docs/ . El HTML del proyecto ya carga 1.8.0.
- Meta, rendimiento WebXR: https://developers.meta.com/vr/documentation/web/webxr-perf-bp/ . Base para reducir overdraw, limitar luces, comprimir texturas y evitar sombras costosas. No trasladar recomendaciones específicas de otros dispositivos a Quest 3 sin medir.
- Meta, flujo de análisis: https://developers.meta.com/vr/documentation/web/webxr-perf-workflow/ . Referencia para organizar la medición, no validación realizada en este encargo.
