// MEDIDOR DE RENDIMIENTO - ARTEANC VR (módulo 0.5)
//
// Componente A-Frame que muestra un pequeño panel pegado a la vista con:
//   - fps:        fotogramas por segundo (objetivo en el Quest 3: 72)
//   - llamadas:   llamadas de dibujo (draw calls) del último fotograma (objetivo < 100)
//   - triangulos: triángulos dibujados en el último fotograma (objetivo < 250 000)
//
// Se activa solo con `?debug` en la dirección (ver `src/depuracion.js`).
// Funciona también dentro del visor, a diferencia del panel `stats` de A-Frame.
//
// Nota: en VR se dibuja una vez por ojo, así que llamadas y triángulos
// incluyen los dos ojos (el doble que en el PC para la misma vista).
// Los textos van sin tildes porque la fuente por defecto de A-Frame no las
// tiene (se corregirá en el módulo 1.5).

AFRAME.registerComponent('medidor-rendimiento', {
  schema: {
    intervalo: { type: 'number', default: 500 } // ms entre actualizaciones
  },

  init: function () {
    this.fotogramas = 0;
    this.inicio = performance.now();

    // Fondo semitransparente y texto, creados aquí para no tocar index.html
    this.el.setAttribute('geometry', { primitive: 'plane', width: 0.36, height: 0.13 });
    this.el.setAttribute('material', { color: '#000', opacity: 0.6, transparent: true, shader: 'flat' });

    this.texto = document.createElement('a-entity');
    this.texto.setAttribute('text', {
      value: 'midiendo...',
      color: '#7CFC00',
      width: 0.34,
      wrapCount: 22,
      align: 'left',
      anchor: 'center',
      baseline: 'center'
    });
    this.texto.setAttribute('position', '0 0 0.001');
    this.el.appendChild(this.texto);
    // El panel no lleva la clase .interactivo: el ratón y los láseres lo ignoran.
  },

  tick: function (tiempo) {
    this.fotogramas++;

    const ahora = performance.now();
    const transcurrido = ahora - this.inicio;
    if (transcurrido < this.data.intervalo) return;

    const fps = Math.round((this.fotogramas * 1000) / transcurrido);

    // renderer.info guarda lo que se dibujó en el último fotograma
    const info = this.el.sceneEl.renderer.info.render;
    const modo = this.el.sceneEl.is('vr-mode') ? 'VR' : 'PC';

    this.texto.setAttribute('text', 'value',
      `${modo}  fps: ${fps}\n` +
      `llamadas: ${info.calls}\n` +
      `triangulos: ${info.triangles.toLocaleString('es')}`
    );

    // Guardamos la última lectura para poder consultarla desde la consola:
    //   document.querySelector('[medidor-rendimiento]').components['medidor-rendimiento'].ultima
    this.ultima = { modo, fps, llamadas: info.calls, triangulos: info.triangles };

    this.fotogramas = 0;
    this.inicio = ahora;
  }
});
