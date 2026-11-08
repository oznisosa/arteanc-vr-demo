// CASA GREYBOX - ARTEANC VR (módulo 1.7)
//
// Componente A-Frame que levanta TODA la Casa ArteAnc con volúmenes simples, a
// escala real, a partir de `datos/salas.json` (generado del diseño congelado):
//   - suelos y techos de cada sala (sin techo en patio y galería: cielo abierto);
//   - muros de 0,40 m con los accesos trapezoidales y las hornacinas recortados;
//   - el portal del Santuario (bloque de 1,2 m de fondo con su túnel);
//   - soportes de exhibición (peanas, vitrinas, mesas), cartelas y una pieza
//     de referencia del tamaño previsto en cada posición;
//   - elementos fijos (canal, mostrador, lámpara, regla, lupa) y el nombre de cada sala.
//
// Uso:  <a-entity casa-greybox></a-entity>   (en casa.html)
//
// Rendimiento: todo lo del mismo material se FUSIONA en una sola malla, así la
// casa entera cuesta ~15 llamadas de dibujo en lugar de cientos.

import { geometriaMuro, geometriaPortal, geometriaLosa, geometriaCaja, fusionar } from './geometria.js';
import { FUENTES } from '../escena/fuentes.js';

const THREE = AFRAME.THREE;

// Colores de la paleta del diseño final (DISENO_FINAL.md §4)
const COLOR = {
  muro: '#E9E0D2',        // adobe encalado
  suelo: '#D5C5B0',       // piedra clara
  sueloExterior: '#C9B89F',
  techo: '#F2ECE2',
  soporte: '#A98158',     // madera clara
  soporteSantuario: '#302A27', // basalto
  vidrio: '#BFD3D6',
  pieza: '#B96645',       // terracota: piezas de referencia
  cartela: '#FFF4E6',     // marfil de interfaz
  forroBronce: '#795A44',
  forroYeso: '#E9E0D2',
  agua: '#A8BCB9',
  piedraCanal: '#A89A86',
  mostrador: '#A98158',
  detalle: '#493021'
};

const redondear = (n) => Math.round(n * 1000) / 1000;

AFRAME.registerComponent('casa-greybox', {
  schema: {
    datos: { default: './datos/salas.json' }
  },

  init: async function () {
    const respuesta = await fetch(this.data.datos);
    this.salas = await respuesta.json();
    this.construir(this.salas);
    this.el.emit('casa-construida', { resumen: this.resumen });
  },

  construir: function (d) {
    const g = d.grosorMuro;
    const grupos = {}; // color → lista de geometrías (se fusionan al final)
    const anadir = (color, ...geos) => (grupos[color] ??= []).push(...geos);

    const salas = Object.fromEntries(d.salas.map((s) => [s.id, s]));
    const rect = (s) => ({
      x0: s.centro[0] - s.tamano[0] / 2, x1: s.centro[0] + s.tamano[0] / 2,
      z0: s.centro[2] - s.tamano[2] / 2, z1: s.centro[2] + s.tamano[2] / 2
    });

    // 1. SUELO GENERAL bajo toda la casa (tapa umbrales y juntas entre salas)
    const L = d.limites;
    anadir(COLOR.sueloExterior, geometriaLosa(L.x[0], L.x[1], L.z[0], L.z[1]));

    // 2. SUELOS Y TECHOS DE CADA SALA
    const ranura = d.arquitectura.ranuraCenital;
    for (const s of d.salas) {
      const r = rect(s);
      const suelo = geometriaLosa(r.x0, r.x1, r.z0, r.z1);
      suelo.translate(0, 0.005, 0); // un poco por encima del suelo general
      anadir(COLOR.suelo, suelo);

      if (!s.cieloAbierto) {
        // Techo mirando hacia abajo; el Santuario lleva la ranura cenital
        const agujeros = [];
        if (s.id === ranura.sala) {
          const [cx, , cz] = ranura.centro;
          const [ax, , az] = ranura.tamano;
          agujeros.push({ x0: cx - ax / 2, x1: cx + ax / 2, z0: cz - az / 2, z1: cz + az / 2 });
        }
        const techo = geometriaLosa(r.x0 - g, r.x1 + g, r.z0 - g, r.z1 + g, agujeros);
        techo.rotateX(Math.PI);                 // dar la vuelta: cara hacia abajo…
        techo.scale(1, 1, -1);                  // …sin invertir el norte y el sur
        techo.translate(0, s.tamano[1], 0);
        anadir(COLOR.techo, techo);
      }
    }

    // 3. MUROS
    // Cada sala aporta 4 muros en sus bordes (centrados medio muro hacia fuera).
    // Los muros de dos salas vecinas caen en la misma línea: se UNEN.
    const lineas = {}; // "ew:z" o "ns:x" → { tipo, coord, tramos: [[a, b, alto]] }
    const anadirTramo = (tipo, coord, a, b, alto) => {
      const clave = `${tipo}:${redondear(coord)}`;
      (lineas[clave] ??= { tipo, coord: redondear(coord), tramos: [] }).tramos.push([a, b, alto]);
    };
    for (const s of d.salas) {
      const r = rect(s);
      const h = s.tamano[1];
      anadirTramo('ew', r.z0 - g / 2, r.x0 - g, r.x1 + g, h); // norte
      anadirTramo('ew', r.z1 + g / 2, r.x0 - g, r.x1 + g, h); // sur
      anadirTramo('ns', r.x0 - g / 2, r.z0 - g, r.z1 + g, h); // oeste
      anadirTramo('ns', r.x1 + g / 2, r.z0 - g, r.z1 + g, h); // este
    }

    // Zonas sin muro: la apertura de la galería sur al patio y el portal
    // del Santuario (que se construye aparte como un bloque).
    const ap = d.arquitectura.galeriaSur.aperturaAlPatio;
    const portal = d.arquitectura.portalSantuario;
    const cortes = [
      { tipo: 'ew', desde: ap.z - g, hasta: ap.z + g, a: ap.x[0], b: ap.x[1] },
      { tipo: 'ew', desde: portal.limites.z[0], hasta: portal.limites.z[1], a: portal.limites.x[0], b: portal.limites.x[1] }
    ];

    // Accesos normales (el del portal ya va en su bloque)
    const accesos = d.accesos.filter((a) => a.id !== portal.acceso);

    // Hornacinas: agujeros en el muro + fondo del nicho (forro)
    const nicho = d.arquitectura.hornacina;
    const hornacinas = d.posiciones.filter((p) => p.tipo === 'hornacina');

    this.resumen = { muros: 0, accesos: accesos.length + 1, hornacinas: hornacinas.length, posiciones: d.posiciones.length };

    for (const linea of Object.values(lineas)) {
      // Unir tramos solapados de la misma línea
      const tramos = linea.tramos.sort((p, q) => p[0] - q[0]);
      const unidos = [];
      for (const [a, b, h] of tramos) {
        const ultimo = unidos[unidos.length - 1];
        if (ultimo && a <= ultimo[1] + 1e-6) {
          ultimo[1] = Math.max(ultimo[1], b);
          ultimo[2] = Math.max(ultimo[2], h);
        } else unidos.push([a, b, h]);
      }

      // Restar las zonas sin muro que cruzan esta línea
      let piezas = unidos;
      for (const c of cortes) {
        if (c.tipo !== linea.tipo || linea.coord < c.desde || linea.coord > c.hasta) continue;
        piezas = piezas.flatMap(([a, b, h]) => {
          if (c.b <= a || c.a >= b) return [[a, b, h]];
          const resto = [];
          if (c.a > a) resto.push([a, c.a, h]);
          if (c.b < b) resto.push([c.b, b, h]);
          return resto;
        });
      }

      for (const [a, b, h] of piezas) {
        // Accesos que caen en este tramo de muro
        const huecos = accesos
          .filter((ac) => (ac.muro === 'este-oeste') === (linea.tipo === 'ew'))
          .filter((ac) => {
            const eje = linea.tipo === 'ew' ? ac.centro[2] : ac.centro[0];
            const pos = linea.tipo === 'ew' ? ac.centro[0] : ac.centro[2];
            return Math.abs(eje - linea.coord) <= ac.fondo / 2 + 1e-3 && pos > a && pos < b;
          })
          .map((ac) => ({
            centro: linea.tipo === 'ew' ? ac.centro[0] : ac.centro[2],
            anchoBase: ac.anchoBase, anchoSuperior: ac.anchoSuperior, alto: ac.alto
          }));

        // Hornacinas que caen en este tramo
        const ventanas = [];
        for (const p of hornacinas) {
          const [x, y, z] = p.apoyo;
          const giro = ((p.orientacion[1] % 360) + 360) % 360;
          const enEsteOeste = giro === 0 || giro === 180;
          if (enEsteOeste !== (linea.tipo === 'ew')) continue;
          const eje = linea.tipo === 'ew' ? z : x;
          const pos = linea.tipo === 'ew' ? x : z;
          if (Math.abs(eje - linea.coord) > g / 2 + 1e-3 || pos <= a || pos >= b) continue;
          ventanas.push({ centro: pos, anchoBase: nicho.anchoBase, anchoSuperior: nicho.anchoSuperior, base: y, alto: nicho.alto });

          // Fondo del nicho: tapa la parte del muro que queda detrás de la hornacina
          const frente = new THREE.Vector3(Math.sin(THREE.MathUtils.degToRad(giro)), 0, Math.cos(THREE.MathUtils.degToRad(giro)));
          const fondoNicho = g - nicho.fondo; // lo que queda de muro detrás del hueco
          const cx = (linea.tipo === 'ns' ? linea.coord : x) - frente.x * (g / 2 - fondoNicho / 2);
          const cz = (linea.tipo === 'ew' ? linea.coord : z) - frente.z * (g / 2 - fondoNicho / 2);
          const forro = p.sala === 'santuario' ? COLOR.forroBronce : COLOR.forroYeso;
          anadir(forro, geometriaCaja(nicho.anchoBase, nicho.alto, fondoNicho, cx, y + nicho.alto / 2, cz, giro));
        }

        // Fabricar el muro y llevarlo a su sitio
        for (const geo of geometriaMuro(a, b, h, g, huecos, ventanas)) {
          if (linea.tipo === 'ew') {
            geo.translate(0, 0, linea.coord);                  // u = x, a lo largo del eje X
          } else {
            // Girar −90° en Y: el eje u (antes X) pasa a apuntar a +Z (a lo largo del muro)
            // y el grosor (antes Z) queda en X. Después se lleva a su línea.
            geo.rotateY(-Math.PI / 2);
            geo.translate(linea.coord, 0, 0);
          }
          anadir(COLOR.muro, geo);
          this.resumen.muros++;
        }
      }
    }

    // 4. PORTAL DEL SANTUARIO: bloque de 1,2 m de fondo con su túnel trapezoidal
    const pl = portal.limites;
    for (const geo of geometriaPortal(pl.x[1] - pl.x[0], pl.y[1] - pl.y[0], pl.z[1] - pl.z[0],
      portal.anchoBase, portal.anchoSuperior, portal.alto)) {
      geo.translate((pl.x[0] + pl.x[1]) / 2, 0, (pl.z[0] + pl.z[1]) / 2);
      anadir(COLOR.muro, geo);
    }

    // 5. SOPORTES, CARTELAS Y PIEZAS DE REFERENCIA
    for (const p of d.posiciones) {
      const [x, y, z] = p.apoyo;
      const giro = p.orientacion[1];
      const [sx, sy, sz] = p.tamanoSoporte;
      const colorSoporte = p.sala === 'santuario' ? COLOR.soporteSantuario : COLOR.soporte;

      if (p.tipo === 'peana' || p.tipo === 'mesa') {
        // El apoyo es la cara de arriba: la caja baja desde ahí hasta el suelo
        anadir(colorSoporte, geometriaCaja(sx, y, sz, x, y / 2, z, giro));
      } else if (p.tipo === 'vitrina') {
        // Base opaca hasta el apoyo + urna de vidrio por encima
        anadir(colorSoporte, geometriaCaja(sx, y, sz, x, y / 2, z, giro));
        anadir(COLOR.vidrio, geometriaCaja(sx, sy - y, sz, x, y + (sy - y) / 2, z, giro));
      }
      // (las hornacinas ya son huecos en el muro)

      // Pieza de referencia: cilindro del alto previsto, para juzgar la escala
      const pieza = new THREE.CylinderGeometry(0.11, 0.13, p.altoPieza, 16);
      pieza.translate(x, y + p.altoPieza / 2, z);
      anadir(COLOR.pieza, pieza);

      // Cartela: placa marfil con su inclinación
      const [cw, ch] = p.cartela.tamano;
      const cartela = new THREE.PlaneGeometry(cw, ch);
      const [rx, ry, rz] = p.cartela.orientacion.map((a) => THREE.MathUtils.degToRad(a));
      cartela.applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, rz, 'YXZ')));
      cartela.translate(...p.cartela.centro);
      anadir(COLOR.cartela, cartela);
    }

    // 6. ELEMENTOS FIJOS
    for (const e of d.elementos) {
      const [x, y, z] = e.centro;
      const [sx, sy, sz] = e.tamano;
      if (e.tipo === 'canal_agua') {
        // Borde de piedra hasta el nivel del agua y la lámina de agua encima
        // (simplificado: en el diseño el borde sube 7 cm más que el agua)
        anadir(COLOR.piedraCanal, geometriaCaja(sx, e.nivelAgua, sz, x, e.nivelAgua / 2, z));
        anadir(COLOR.agua, geometriaCaja(sx - 0.1, 0.01, sz - 0.1, x, e.nivelAgua + 0.005, z));
      } else if (e.tipo === 'mostrador') {
        anadir(COLOR.mostrador, geometriaCaja(sx, sy, sz, x, y, z));
      } else {
        anadir(COLOR.detalle, geometriaCaja(sx, sy, sz, x, y, z));
      }
    }

    // 7. FUSIONAR: una malla por color = una llamada de dibujo por color
    const casa = new THREE.Group();
    for (const [color, geos] of Object.entries(grupos)) {
      const transparente = color === COLOR.vidrio;
      const material = new THREE.MeshStandardMaterial({
        color, roughness: 0.9, metalness: 0,
        side: THREE.DoubleSide,
        transparent: transparente, opacity: transparente ? 0.35 : 1
      });
      const malla = new THREE.Mesh(fusionar(geos), material);
      malla.name = `greybox-${color}`;
      casa.add(malla);
    }
    this.el.setObject3D('casa', casa);
    this.resumen.mallas = casa.children.length;

    // 8. NOMBRE DE CADA SALA, MIRANDO A CADA ENTRADA
    // Por cada acceso a la sala se pone un letrero que mira hacia ese acceso,
    // desplazado desde el centro hacia él: quien entra lo ve de frente,
    // entre por donde entre (Cerámica y Textiles se entran por un lado).
    const entradas = {}; // sala → lista de puntos [x, z] por donde se entra
    const anadirEntrada = (sala, x, z) => (entradas[sala] ??= []).push([x, z]);
    for (const ac of d.accesos) {
      anadirEntrada(ac.desde, ac.centro[0], ac.centro[2]);
      anadirEntrada(ac.hacia, ac.centro[0], ac.centro[2]);
    }
    // El patio también se entra por la apertura libre de la galería sur
    anadirEntrada('patio', (ap.x[0] + ap.x[1]) / 2, ap.z);

    for (const s of d.salas) {
      if (s.papel === 'circulacion') continue;
      const [cx, , cz] = s.centro;
      for (const [ex, ez] of entradas[s.id] ?? []) {
        // A un tercio del camino entre el centro de la sala y la entrada
        const x = cx + (ex - cx) * 0.35;
        const z = cz + (ez - cz) * 0.35;
        const giro = THREE.MathUtils.radToDeg(Math.atan2(ex - x, ez - z)); // frente (+Z) hacia la entrada
        const t = document.createElement('a-entity');
        // Letrero discreto cerca del techo (letras de ~9 cm de ancho)
        t.setAttribute('text', { value: s.nombre.toUpperCase(), align: 'center', color: '#493021', width: 2.4, wrapCount: 26, font: FUENTES.titulo });
        t.setAttribute('position', `${x} ${Math.min(s.tamano[1] - 0.7, 3.3)} ${z}`);
        t.setAttribute('rotation', `0 ${giro} 0`);
        t.classList.add('nombre-sala');
        this.el.appendChild(t);
      }
    }
  }
});
