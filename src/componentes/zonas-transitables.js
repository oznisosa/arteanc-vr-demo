// ZONAS TRANSITABLES - ARTEANC VR (módulo 2.3, DT-032)
//
// Componente A-Frame que va en el #jugador. Prepara el MAPA TRANSITABLE
// (src/movimiento/mapa-transitable.js) y lo comparte con los demás
// componentes de movimiento:
//   - caminar-quest  → camina deslizándose por paredes y muebles;
//   - teletransporte → el arco choca con muros y muebles, y solo vale caer
//                      en suelo pisable;
//   - y en cada fotograma, si la cabeza entra donde no debe (WASD en el PC o
//     un paso real en el visor), se devuelve al jugador al último punto
//     válido, deslizándolo.
//
// Dos formas de darle los datos (nada fijo en el código):
//
//   1) Desde datos/salas.json (la casa completa, casa.html):
//        zonas-transitables="datos: ./datos/salas.json"
//
//   2) Escritos en el HTML (la sala de index.html):
//        zonas-transitables="suelos: -5.9 5.9 -5.9 2.82; alto: 4;
//                            obstaculos: .peana, #mostradorRecepcion"
//      `suelos` son rectángulos "x0 x1 z0 z1" separados por comas.
//      `obstaculos` es un selector CSS: se mide cada elemento al cargar la
//      escena (los cilindros como círculos; lo demás, su caja).
//
// Para VER el mapa (líneas verdes = suelo, rojas = obstáculos con el margen
// del cuerpo), abrir la página con ?zonas en la dirección.

import { MapaTransitable, mapaDesdeSalas, RADIO_CUERPO } from '../movimiento/mapa-transitable.js';

const THREE = AFRAME.THREE;

AFRAME.registerComponent('zonas-transitables', {
  schema: {
    datos: { type: 'string', default: '' },
    suelos: { type: 'string', default: '' },
    alto: { type: 'number', default: 4 },
    obstaculos: { type: 'string', default: '' },
    radio: { type: 'number', default: RADIO_CUERPO },
    camara: { type: 'selector', default: '#camara' },
    mostrar: { type: 'boolean', default: false }
  },

  init: function () {
    this.mapa = null;     // null mientras se prepara (los demás lo comprueban)
    this.ultimoValido = null;
    this.cabeza = new THREE.Vector3();

    const escena = this.el.sceneEl;
    if (escena.hasLoaded) this.preparar();
    else escena.addEventListener('loaded', () => this.preparar(), { once: true });
  },

  preparar: async function () {
    const d = this.data;
    try {
      if (d.datos) {
        const respuesta = await fetch(d.datos);
        this.mapa = mapaDesdeSalas(await respuesta.json(), d.radio);
      } else {
        this.mapa = new MapaTransitable({
          suelos: this.leerSuelos(d.suelos),
          espacios: this.leerSuelos(d.suelos).map((s) => ({ ...s, alto: d.alto })),
          obstaculos: this.medirObstaculos(d.obstaculos),
          radio: d.radio
        });
      }
    } catch (error) {
      console.error('[zonas-transitables] No se pudo preparar el mapa:', error);
      return;
    }

    const verMapa = d.mostrar || new URLSearchParams(location.search).has('zonas');
    if (verMapa) this.dibujarMapa();

    console.info('[ArteAnc] Mapa transitable:', this.mapa.suelos.length, 'suelos,',
      this.mapa.obstaculos.length, 'obstáculos');
    this.el.emit('mapa-listo', { mapa: this.mapa });
  },

  // "x0 x1 z0 z1, x0 x1 z0 z1" → [{x0, x1, z0, z1}, ...]
  leerSuelos: function (texto) {
    return texto.split(',').map((t) => t.trim()).filter(Boolean).map((t) => {
      const [x0, x1, z0, z1] = t.split(/\s+/).map(Number);
      return { x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1) };
    });
  },

  // Mide en el mundo cada elemento del selector y lo convierte en obstáculo
  medirObstaculos: function (selector) {
    if (!selector) return [];
    const obstaculos = [];
    const caja = new THREE.Box3();
    const centro = new THREE.Vector3();
    const tamano = new THREE.Vector3();

    for (const el of document.querySelectorAll(selector)) {
      // updateWorldMatrix(true, true): actualiza también los PADRES. Sin esto,
      // una peana dentro de su pieza se medía en (0, 0), como si la pieza no
      // se hubiera movido todavía.
      el.object3D.updateWorldMatrix(true, true);
      caja.setFromObject(el.object3D);
      if (caja.isEmpty()) continue;
      caja.getCenter(centro);
      caja.getSize(tamano);

      if (el.tagName === 'A-CYLINDER') {
        obstaculos.push({ tipo: 'circulo', id: el.id || 'cilindro', cx: centro.x, cz: centro.z,
          radio: Math.max(tamano.x, tamano.z) / 2, alto: caja.max.y });
      } else {
        obstaculos.push({ tipo: 'rect', id: el.id || el.tagName.toLowerCase(), cx: centro.x, cz: centro.z,
          ancho: tamano.x, fondo: tamano.z, giro: 0, alto: caja.max.y });
      }
    }
    return obstaculos;
  },

  // ---------- Lo que usan los demás componentes ----------

  // Mueve el #jugador (dx, dz) metros, deslizando la CABEZA por paredes y muebles
  moverJugador: function (dx, dz) {
    const posicion = this.el.object3D.position;
    if (!this.mapa) { posicion.x += dx; posicion.z += dz; return; }

    this.data.camara.object3D.getWorldPosition(this.cabeza);
    const desde = { x: this.cabeza.x, z: this.cabeza.z };
    const hasta = this.mapa.deslizar(desde, { x: desde.x + dx, z: desde.z + dz });
    posicion.x += hasta.x - desde.x;
    posicion.z += hasta.z - desde.z;
  },

  // ---------- Cada fotograma: que la cabeza no quede dentro de nada ----------

  tick: function () {
    if (!this.mapa) return;
    this.data.camara.object3D.getWorldPosition(this.cabeza);
    const x = this.cabeza.x;
    const z = this.cabeza.z;

    if (this.mapa.esTransitable(x, z)) {
      this.ultimoValido = { x, z };
      return;
    }
    if (!this.ultimoValido) return; // empezó fuera: no sabemos adónde volver

    // Volver deslizando desde el último punto válido
    const corregido = this.mapa.deslizar(this.ultimoValido, { x, z });
    this.el.object3D.position.x += corregido.x - x;
    this.el.object3D.position.z += corregido.z - z;
    this.ultimoValido = corregido;
  },

  // ---------- Dibujo de ayuda (?zonas) ----------

  dibujarMapa: function () {
    const verde = [];
    const rojo = [];
    const y = 0.03;
    const r = this.mapa.radio;

    const rectangulo = (lista, cx, cz, ancho, fondo, giroGrados) => {
      const a = THREE.MathUtils.degToRad(giroGrados || 0);
      const esquinas = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([sx, sz]) => {
        const lx = sx * ancho / 2;
        const lz = sz * fondo / 2;
        // de los ejes del obstáculo al mundo (rotación Y de THREE)
        return [cx + lx * Math.cos(a) + lz * Math.sin(a), cz - lx * Math.sin(a) + lz * Math.cos(a)];
      });
      for (let i = 0; i < 4; i++) {
        const [x0, z0] = esquinas[i];
        const [x1, z1] = esquinas[(i + 1) % 4];
        lista.push(x0, y, z0, x1, y, z1);
      }
    };

    // Suelo útil para la cabeza: cada suelo encogido un radio
    for (const s of this.mapa.suelos) {
      rectangulo(verde, (s.x0 + s.x1) / 2, (s.z0 + s.z1) / 2, s.x1 - s.x0 - 2 * r, s.z1 - s.z0 - 2 * r, 0);
    }
    // Obstáculos agrandados un radio
    for (const o of this.mapa.obstaculos) {
      if (o.tipo === 'circulo') {
        const n = 32;
        for (let i = 0; i < n; i++) {
          const a0 = (i / n) * Math.PI * 2;
          const a1 = ((i + 1) / n) * Math.PI * 2;
          const R = o.radio + r;
          rojo.push(o.cx + R * Math.cos(a0), y, o.cz + R * Math.sin(a0), o.cx + R * Math.cos(a1), y, o.cz + R * Math.sin(a1));
        }
      } else {
        rectangulo(rojo, o.cx, o.cz, o.ancho + 2 * r, o.fondo + 2 * r, o.giro);
      }
    }

    const grupo = new THREE.Group();
    grupo.userData.ayuda = true; // los clics en el suelo (2.6) lo ignoran
    for (const [puntos, color] of [[verde, '#2E8B57'], [rojo, '#C0392B']]) {
      const geometria = new THREE.BufferGeometry();
      geometria.setAttribute('position', new THREE.Float32BufferAttribute(puntos, 3));
      grupo.add(new THREE.LineSegments(geometria, new THREE.LineBasicMaterial({ color })));
    }
    this.el.sceneEl.object3D.add(grupo);
  }
});
