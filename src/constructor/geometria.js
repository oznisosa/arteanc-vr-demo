// HERRAMIENTAS DE GEOMETRÍA DEL CONSTRUCTOR - ARTEANC VR (módulo 1.7)
//
// Funciones puras (sin A-Frame) para fabricar las piezas del greybox con
// Three.js: muros con huecos trapezoidales, losas y la FUSIÓN de muchas
// geometrías en una sola. Fusionar importa en el Quest: cada malla es una
// llamada de dibujo, y el presupuesto es de menos de 100 (ARQUITECTURA §5).

const THREE = AFRAME.THREE;
const EPS = 1e-6;

// Ancho de un trapecio (base `ab`, techo `at`, alto `h`) a la altura `y`
function anchoA(ab, at, h, y) {
  return ab + (at - ab) * Math.min(1, Math.max(0, y / h));
}

/**
 * Muro recto con huecos trapezoidales (accesos) y hornacinas.
 * El muro se dibuja en un plano local: `u` a lo largo del muro (de `desde` a
 * `hasta`), `v` hacia arriba (0 = suelo), y se extruye con su grosor.
 *
 * @param {number} desde, hasta  extremos del muro en `u`
 * @param {number} alto          alto del muro
 * @param {number} grosor        espesor (se extruye centrado en 0)
 * @param {Array} huecos   [{ centro, anchoBase, anchoSuperior, alto }] que tocan el suelo
 * @param {Array} ventanas [{ centro, anchoBase, anchoSuperior, base, alto }] que no tocan el suelo (hornacinas)
 * @returns {THREE.BufferGeometry[]} una o varias geometrías (varias si un hueco llega hasta arriba)
 */
export function geometriaMuro(desde, hasta, alto, grosor, huecos = [], ventanas = []) {
  const ordenados = [...huecos].sort((a, b) => a.centro - b.centro);

  // Contorno: se recorre el suelo de izquierda a derecha "mordiendo" cada hueco.
  // Si un hueco llega hasta arriba del muro, corta el muro en dos piezas.
  const piezas = [];
  let puntos = [[desde, 0]];

  for (const h of ordenados) {
    const altoHueco = Math.min(h.alto, alto);
    const mitadBase = h.anchoBase / 2;
    const mitadTecho = anchoA(h.anchoBase, h.anchoSuperior, h.alto, altoHueco) / 2;

    puntos.push([h.centro - mitadBase, 0], [h.centro - mitadTecho, altoHueco]);
    if (altoHueco >= alto - EPS) {
      // El hueco corta el muro entero: cerrar esta pieza y empezar otra
      puntos.push([desde, alto]);
      piezas.push(puntos);
      puntos = [[h.centro + mitadTecho, alto], [h.centro + mitadBase, 0]];
      desde = h.centro + mitadTecho; // la nueva pieza cierra por arriba aquí
    } else {
      puntos.push([h.centro + mitadTecho, altoHueco], [h.centro + mitadBase, 0]);
    }
  }
  puntos.push([hasta, 0], [hasta, alto], [desde, alto]);
  piezas.push(puntos);

  return piezas.map((contorno) => {
    const forma = new THREE.Shape(contorno.map(([u, v]) => new THREE.Vector2(u, v)));

    // Hornacinas: agujeros que no tocan el suelo (si caen dentro de esta pieza)
    const minU = Math.min(...contorno.map((p) => p[0]));
    const maxU = Math.max(...contorno.map((p) => p[0]));
    for (const w of ventanas) {
      if (w.centro < minU || w.centro > maxU) continue;
      const b = w.anchoBase / 2;
      const t = w.anchoSuperior / 2;
      forma.holes.push(new THREE.Path([
        new THREE.Vector2(w.centro - b, w.base),
        new THREE.Vector2(w.centro + b, w.base),
        new THREE.Vector2(w.centro + t, w.base + w.alto),
        new THREE.Vector2(w.centro - t, w.base + w.alto)
      ]));
    }

    const g = new THREE.ExtrudeGeometry(forma, { depth: grosor, bevelEnabled: false });
    g.translate(0, 0, -grosor / 2); // centrar el espesor
    return g;
  });
}

/**
 * Bloque con un túnel trapezoidal que lo atraviesa (portal del Santuario).
 * Se dibuja de frente (ancho × alto) y se extruye con su fondo.
 */
export function geometriaPortal(ancho, alto, fondo, anchoBase, anchoSuperior, altoHueco) {
  const piezas = geometriaMuro(-ancho / 2, ancho / 2, alto, fondo,
    [{ centro: 0, anchoBase, anchoSuperior, alto: altoHueco }]);
  return piezas;
}

/** Losa horizontal (suelo o techo) con agujeros rectangulares opcionales, en el plano XZ. */
export function geometriaLosa(x0, x1, z0, z1, agujeros = []) {
  // Se dibuja en XY con y = −z y se tumba: así la cara queda hacia arriba
  const forma = new THREE.Shape([
    new THREE.Vector2(x0, -z1), new THREE.Vector2(x1, -z1),
    new THREE.Vector2(x1, -z0), new THREE.Vector2(x0, -z0)
  ]);
  for (const a of agujeros) {
    forma.holes.push(new THREE.Path([
      new THREE.Vector2(a.x0, -a.z1), new THREE.Vector2(a.x1, -a.z1),
      new THREE.Vector2(a.x1, -a.z0), new THREE.Vector2(a.x0, -a.z0)
    ]));
  }
  const g = new THREE.ShapeGeometry(forma);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Caja centrada en (x, y, z), girada `giroY` grados alrededor del eje vertical. */
export function geometriaCaja(ancho, alto, fondo, x, y, z, giroY = 0) {
  const g = new THREE.BoxGeometry(ancho, alto, fondo);
  if (giroY) g.rotateY(THREE.MathUtils.degToRad(giroY));
  g.translate(x, y, z);
  return g;
}

/**
 * Fusiona muchas geometrías en una sola (= una sola llamada de dibujo).
 * Solo conserva posición y normal, que es lo que usa el greybox.
 */
export function fusionar(geometrias) {
  const partes = geometrias.map((g) => (g.index ? g.toNonIndexed() : g));
  const total = partes.reduce((n, g) => n + g.attributes.position.count, 0);
  const posiciones = new Float32Array(total * 3);
  const normales = new Float32Array(total * 3);

  let i = 0;
  for (const g of partes) {
    if (!g.attributes.normal) g.computeVertexNormals();
    posiciones.set(g.attributes.position.array, i * 3);
    normales.set(g.attributes.normal.array, i * 3);
    i += g.attributes.position.count;
  }

  const resultado = new THREE.BufferGeometry();
  resultado.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));
  resultado.setAttribute('normal', new THREE.BufferAttribute(normales, 3));
  resultado.computeBoundingSphere();
  return resultado;
}
