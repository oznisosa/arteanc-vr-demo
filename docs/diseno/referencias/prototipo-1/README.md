# ArteAnc VR · Paquete de diseño v1.0

Dirección recomendada: **Santuario andino contemporáneo**. Creado el 7 de noviembre de 2026.

## Cómo abrirlo

Descomprime el ZIP conservando las carpetas. Abre `Abrir_paquete.html` en tu navegador para recorrer imágenes y enlaces. No requiere servidor ni conexión salvo los enlaces externos. La presentación está en PowerPoint editable y PDF. Los manuales se entregan en PDF y Markdown editable.

## Contenido

- `Presentacion_ArteAnc_VR.pptx` y `.pdf`: 13 diapositivas con tres direcciones, propuesta elegida, recorrido e implementación.
- `imagenes/`: ocho láminas PNG originales. Tres conceptos independientes, tres láminas de cuatro vistas arquitectónicas, vista general e interfaces. Las vistas arquitectónicas cubren fachada, entrada, recepción, galería, salas, exhibidores, examen, compra, educación, asistente y pasillos.
- `Plano_maestro.svg`, `.png` y `.pdf`: distribución nominal de 40 × 36 m y recorrido. SVG editable.
- `Manual_diseno.md` y `.pdf`: criterios visuales y especificaciones.
- `Guia_implementacion.md` y `.pdf`: componentes, etapas, presupuestos propuestos y pruebas para Claude Code.
- `Prototipo_UI.html`: maqueta navegable 2D con ficha, estados de disponibilidad, examen simulado, contexto, mapa, ayuda y selección. No contiene un visor 3D ni pagos.
- `layout.json`: coordenadas y conexiones para construir el greybox.
- `producto_ejemplo.json`: contrato inicial de datos con un registro ficticio.
- `prompts_imagenes.json`: instrucciones de generación originales y revisión de interfaces. Se utilizó el generador de imágenes integrado, sin API externa configurada por el usuario.

## Qué está verificado

Se consultó la web de ArteAnc, la estructura pública del repositorio y su index.html. No se pudo verificar la aplicación publicada en ejecución ni leer app.js y catalogo.js. No se midió rendimiento en Meta Quest 3. El código original no se modificó.

## Qué es conceptual

Todas las imágenes, piezas, paisajes y precios de las maquetas son conceptuales. No son capturas del prototipo ni un inventario real. Los renders pueden diferir en detalles: las medidas, conexiones y mobiliario especificados en el plano y manual tienen prioridad. No se incluyen modelos GLB listos para producción. El logo tipográfico es provisional. La presentación contiene imágenes raster y texto editable, no geometría arquitectónica editable.

## Continuidad

Para otra sesión de ChatGPT: adjuntar este ZIP y pedir que conserve la dirección visual, consultando plano y manual antes de proponer cambios. Para Claude Code: comenzar con la instrucción del apartado 8 de la guía, auditar el repositorio y construir la Fase 0. Primera validación pendiente: escala, lectura y navegación en un Quest 3 real.

## Fuentes

- https://arteanc.com/
- https://github.com/oznisosa/arteanc-vr-demo
- https://github.com/oznisosa/arteanc-vr-demo/blob/main/index.html
- https://oznisosa.github.io/arteanc-vr-demo/ (no accesible mediante el lector utilizado)
- https://aframe.io/docs/
- https://aframe.io/docs/1.7.0/introduction/best-practices.html
- https://developers.meta.com/vr/documentation/web/webxr-perf-bp/
- https://developers.meta.com/vr/documentation/web/webxr-perf-workflow/

Consulta: 07/11/2026. Fuentes y límites específicos en los manuales.
