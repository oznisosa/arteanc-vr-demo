// PIEZA EXHIBIDA - ARTEANC VR (módulo 1.2)
//
// Componente A-Frame que monta una pieza completa a partir del catálogo:
//   1. la PEANA (caja o cilindro) apoyada en el suelo;
//   2. el MODELO 3D de `modelos.galeria`, encima de la peana y a escala:
//        - si el catálogo tiene `dimensiones_m`, a su ALTO real;
//        - si no (null = desconocido), su dimensión mayor mide `tamanoSinMedidas`;
//      si la pieza aún no tiene modelo, una FORMA PROVISIONAL (esfera, cono o caja);
//   3. la hace INTERACTIVA: al hacer clic gira una vuelta y la ficha se abre
//      (la ficha escucha el clic en la entidad con clase .producto).
//
// Uso en index.html — la posición es el punto del SUELO en el centro de la peana:
//   <a-entity id="pieza02" class="producto" position="0 0 -3.5"
//             pieza-exhibida="pieza: pieza02; tamanoSinMedidas: 0.65"></a-entity>

import { catalogoListo } from '../datos/catalogo-servicio.js';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('pieza-exhibida', {
  schema: {
    pieza: { type: 'string' },                              // `id` en datos/catalogo.json
    // 'ninguna': la pieza se apoya directamente en la posición de la entidad
    // (en la casa, el soporte ya lo dibuja el greybox: módulo 1.8)
    peanaForma: { default: 'caja', oneOf: ['caja', 'cilindro', 'ninguna'] },
    peanaTamano: { type: 'vec3', default: { x: 0.5, y: 1, z: 0.5 } }, // ancho, alto, fondo (m)
    peanaColor: { type: 'color', default: '#755C45' },
    tamanoSinMedidas: { type: 'number', default: 0.4 },    // m, si dimensiones_m es null
    formaProvisional: { default: 'caja', oneOf: ['caja', 'esfera', 'cono'] },
    colorProvisional: { type: 'color', default: '#A08C78' }
  },

  init: function () {
    this.crearPeana();

    catalogoListo
      .then((catalogo) => {
        const datos = catalogo[this.data.pieza];
        if (!datos) {
          console.warn('[pieza-exhibida] No está en el catálogo:', this.data.pieza);
        }
        this.crearPieza(datos);
      })
      .catch((error) => console.error('[pieza-exhibida]', error));
  },

  // 1. PEANA: su base toca el suelo (y = 0 de la entidad)
  crearPeana: function () {
    if (this.data.peanaForma === 'ninguna') return;
    const t = this.data.peanaTamano;
    const peana = document.createElement(this.data.peanaForma === 'cilindro' ? 'a-cylinder' : 'a-box');

    if (this.data.peanaForma === 'cilindro') {
      peana.setAttribute('radius', t.x / 2);
    } else {
      peana.setAttribute('width', t.x);
      peana.setAttribute('depth', t.z);
    }
    peana.setAttribute('height', t.y);
    peana.setAttribute('position', `0 ${t.y / 2} 0`);
    peana.setAttribute('color', this.data.peanaColor);
    peana.classList.add('peana');
    this.el.appendChild(peana);
  },

  // 2. PIEZA: modelo 3D o forma provisional, apoyada sobre la peana
  crearPieza: function (datos) {
    const alturaPeana = this.data.peanaForma === 'ninguna' ? 0 : this.data.peanaTamano.y;
    const rutaModelo = datos?.modelos?.galeria;

    const pieza = document.createElement('a-entity');
    pieza.classList.add('interactivo'); // la apuntan el ratón y los láseres

    // Las formas provisionales están centradas en su origen: hay que subirlas
    // media altura para que su base toque la peana. Los modelos se apoyan
    // solos en escalarModelo().
    const subida = rutaModelo ? 0 : this.data.tamanoSinMedidas / 2;
    pieza.setAttribute('position', `0 ${alturaPeana + subida} 0`);

    // Al hacer clic, una vuelta completa (como el prototipo original)
    pieza.setAttribute('animation__girar', {
      property: 'rotation', from: '0 0 0', to: '0 360 0', dur: 1200, startEvents: 'click'
    });

    if (rutaModelo) {
      pieza.addEventListener('model-loaded', () => this.escalarModelo(pieza, datos));
      pieza.setAttribute('gltf-model', `url(./${rutaModelo})`);
    } else {
      this.crearFormaProvisional(pieza);
    }

    this.el.appendChild(pieza);
  },

  // Escala el modelo y apoya su base en el origen de `pieza` (= arriba de la peana)
  escalarModelo: function (pieza, datos) {
    const modelo = pieza.getObject3D('mesh');
    if (!modelo) return;

    const caja = new THREE.Box3().setFromObject(modelo);
    const tamano = caja.getSize(new THREE.Vector3());
    if (Math.max(tamano.x, tamano.y, tamano.z) <= 0) return;

    let factor;
    if (datos?.dimensiones_m?.alto) {
      // Escala real: el alto del modelo = alto del catálogo
      factor = datos.dimensiones_m.alto / tamano.y;
    } else {
      // Medidas desconocidas: tamaño de exhibición provisional
      factor = this.data.tamanoSinMedidas / Math.max(tamano.x, tamano.y, tamano.z);
    }
    modelo.scale.multiplyScalar(factor);

    // Apoyar la base: medimos de nuevo, en coordenadas de `pieza`
    pieza.object3D.updateMatrixWorld(true);
    const cajaFinal = new THREE.Box3().setFromObject(modelo);
    const baseLocal = pieza.object3D.worldToLocal(cajaFinal.min.clone()).y;
    modelo.position.y -= baseLocal;
  },

  // Forma de relleno mientras la pieza no tiene modelo 3D.
  // Su dimensión mayor mide `tamanoSinMedidas` (su altura se compensa en crearPieza).
  crearFormaProvisional: function (pieza) {
    const s = this.data.tamanoSinMedidas;
    const forma = this.data.formaProvisional;
    const geometrias = {
      esfera: { primitive: 'sphere', radius: s / 2 },
      cono: { primitive: 'cone', height: s, radiusBottom: s / 2, radiusTop: s / 7 },
      caja: { primitive: 'box', width: s, height: s, depth: s }
    };
    pieza.setAttribute('geometry', geometrias[forma]);
    pieza.setAttribute('material', { color: this.data.colorProvisional });
  }
});
