// MAPA TRANSITABLE - ARTEANC VR (módulo 2.3, DT-032)
//
// Un "mapa visto desde arriba" que responde dónde se puede estar.
// Es JavaScript puro (no usa A-Frame), así que se puede probar con Node.
//
// Se compone de:
//   - SUELOS: rectángulos donde se puede pisar (salas y huecos de paso).
//   - OBSTÁCULOS: rectángulos (girados o no) y círculos que NO se pisan
//     (peanas, vitrinas, mesas, mostrador, canal...). Tienen altura, para que
//     el arco del teletransporte choque con ellos.
//   - ESPACIOS: volúmenes de aire por donde puede pasar el arco (cada sala
//     con su techo, o sin techo si es a cielo abierto).
//
// Todas las preguntas se hacen sobre la posición de la CABEZA (x, z): el
// cuerpo se trata como un círculo de radio `radio` alrededor de ella.
//
// Coordenadas: metros; X = este; Z = sur (norte = −Z). Ver CLAUDE.md, regla 6.

export const RADIO_CUERPO = 0.25; // m: medio hombro, con un poco de holgura

// Rectángulo alineado con los ejes: { x0, x1, z0, z1 } (x0 < x1, z0 < z1)
const dentroRect = (r, x, z, margen = 0) =>
  x >= r.x0 + margen && x <= r.x1 - margen && z >= r.z0 + margen && z <= r.z1 - margen;

export class MapaTransitable {
  /**
   * @param {object} opciones
   * @param {Array<{x0,x1,z0,z1}>} opciones.suelos  zonas pisables (SIN encoger)
   * @param {Array} opciones.obstaculos  {tipo:'rect', cx, cz, ancho, fondo, giro (grados), alto}
   *                                     o {tipo:'circulo', cx, cz, radio, alto}
   * @param {Array<{x0,x1,z0,z1,alto}>} opciones.espacios  aire para el arco (alto: Infinity = cielo abierto)
   * @param {number} [opciones.radio]  radio del cuerpo
   */
  constructor({ suelos = [], obstaculos = [], espacios = [], radio = RADIO_CUERPO } = {}) {
    this.suelos = suelos;
    this.obstaculos = obstaculos;
    this.espacios = espacios;
    this.radio = radio;
  }

  // ¿Puede estar aquí la cabeza? El círculo del cuerpo debe caber en algún
  // suelo y no tocar ningún obstáculo.
  esTransitable(x, z) {
    const r = this.radio;
    if (!this.suelos.some((s) => dentroRect(s, x, z, r))) return false;
    return !this.obstaculos.some((o) => this.tocaObstaculo(o, x, z, r));
  }

  // ¿El punto (x, z), con un margen, cae sobre el obstáculo?
  tocaObstaculo(o, x, z, margen = 0) {
    if (o.tipo === 'circulo') {
      return Math.hypot(x - o.cx, z - o.cz) < o.radio + margen;
    }
    // Rectángulo girado: llevamos el punto a los ejes del obstáculo.
    // Mismo convenio que A-Frame / THREE: giro positivo en Y = antihorario visto desde arriba.
    const a = ((o.giro || 0) * Math.PI) / 180;
    const dx = x - o.cx;
    const dz = z - o.cz;
    const lx = dx * Math.cos(a) - dz * Math.sin(a);
    const lz = dx * Math.sin(a) + dz * Math.cos(a);
    return Math.abs(lx) < o.ancho / 2 + margen && Math.abs(lz) < o.fondo / 2 + margen;
  }

  // Movimiento con "deslizamiento": si no se puede ir de `desde` a `hasta`,
  // se intenta avanzar solo en X o solo en Z. Así, al caminar en diagonal
  // contra una pared, se resbala a lo largo de ella en lugar de pararse.
  // Recibe y devuelve {x, z}.
  deslizar(desde, hasta) {
    if (this.esTransitable(hasta.x, hasta.z)) return { x: hasta.x, z: hasta.z };
    if (this.esTransitable(hasta.x, desde.z)) return { x: hasta.x, z: desde.z };
    if (this.esTransitable(desde.x, hasta.z)) return { x: desde.x, z: hasta.z };
    return { x: desde.x, z: desde.z };
  }

  // ¿Puede pasar el arco del teletransporte por este punto del aire?
  // Debe estar dentro de algún espacio (bajo su techo) y no dentro de un obstáculo.
  aireLibre(x, y, z) {
    if (!this.espacios.some((e) => dentroRect(e, x, z) && y < e.alto)) return false;
    return !this.obstaculos.some((o) => y < o.alto && this.tocaObstaculo(o, x, z));
  }
}

// ---------------------------------------------------------------------------
// Construir el mapa desde datos/salas.json (la casa completa, casa.html)
// ---------------------------------------------------------------------------

const ALTURA_MAXIMA_OBSTACULO_SUELO = 0.3; // si la base está más alta, va sobre una mesa: no estorba

export function mapaDesdeSalas(d, radio = RADIO_CUERPO) {
  const rect = (s) => ({
    x0: s.centro[0] - s.tamano[0] / 2, x1: s.centro[0] + s.tamano[0] / 2,
    z0: s.centro[2] - s.tamano[2] / 2, z1: s.centro[2] + s.tamano[2] / 2
  });

  const suelos = [];
  const espacios = [];

  // 1. Cada sala: su suelo libre interior y su volumen de aire
  for (const s of d.salas) {
    const r = rect(s);
    suelos.push(r);
    espacios.push({ ...r, alto: s.cieloAbierto ? Infinity : s.tamano[1] });
  }

  // 2. Accesos entre salas: el hueco atraviesa el muro (fondo) y se alarga
  //    DOS radios de cuerpo hacia cada sala. ¿Por qué dos? esTransitable encoge
  //    cada suelo un radio por todos sus lados: la sala pierde un radio junto
  //    al muro y el hueco otro radio en su extremo. Con solo uno quedaba una
  //    franja sin suelo y no se podía cruzar la puerta caminando.
  //    El acceso al exterior no se incluye: fuera de la casa no hay suelo.
  for (const a of d.accesos) {
    if (a.desde === 'exterior' || a.hacia === 'exterior') continue;
    const [cx, , cz] = a.centro;
    const mitadAncho = a.anchoBase / 2;
    const mitadFondo = a.fondo / 2 + 2 * radio + 0.05;
    const hueco = a.muro === 'este-oeste'
      ? { x0: cx - mitadAncho, x1: cx + mitadAncho, z0: cz - mitadFondo, z1: cz + mitadFondo }
      : { x0: cx - mitadFondo, x1: cx + mitadFondo, z0: cz - mitadAncho, z1: cz + mitadAncho };
    suelos.push(hueco);
    espacios.push({ ...hueco, alto: a.alto ?? d.alturaTecho });
  }

  // 3. Apertura de la galería sur al patio (franja sin muro)
  const ap = d.arquitectura?.galeriaSur?.aperturaAlPatio;
  if (ap) {
    const [zA, zB] = ap.joiningBandZ ?? [ap.z, ap.z + d.grosorMuro];
    const solape = 2 * radio + 0.05; // el mismo motivo que en los accesos
    const franja = { x0: ap.x[0], x1: ap.x[1], z0: Math.min(zA, zB) - solape, z1: Math.max(zA, zB) + solape };
    suelos.push(franja);
    espacios.push({ ...franja, alto: Infinity });
  }

  // 4. Obstáculos: soportes de exhibición (las hornacinas están en el muro)
  const obstaculos = [];
  for (const p of d.posiciones) {
    if (p.tipo === 'hornacina') continue;
    const [x, y, z] = p.apoyo;
    const [sx, sy, sz] = p.tamanoSoporte;
    obstaculos.push({
      tipo: 'rect', id: p.id, cx: x, cz: z, ancho: sx, fondo: sz,
      giro: p.orientacion?.[1] ?? 0,
      alto: Math.max(y, sy) + (p.altoPieza ?? 0) // soporte + pieza encima
    });
  }

  // 5. Elementos fijos apoyados en el suelo (canal, mostrador). Los que están
  //    sobre una mesa (lámpara, regla, lupa) ya quedan dentro de la mesa.
  for (const e of d.elementos) {
    const [x, y, z] = e.centro;
    const [sx, sy, sz] = e.tamano;
    if (y - sy / 2 > ALTURA_MAXIMA_OBSTACULO_SUELO) continue;
    obstaculos.push({ tipo: 'rect', id: e.id, cx: x, cz: z, ancho: sx, fondo: sz, giro: 0, alto: y + sy / 2 });
  }

  return new MapaTransitable({ suelos, obstaculos, espacios, radio });
}
