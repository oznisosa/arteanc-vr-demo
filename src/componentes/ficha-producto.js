// FICHA DE PRODUCTO - ARTEANC VR (módulo 1.3)
//
// Componente A-Frame para la ficha que aparece JUNTO a la pieza elegida.
// Diseño final (DISENO_FINAL.md §7): panel marfil opaco de 0,95 m de ancho
// (0,62 m de alto como mínimo; crece si el texto es largo), texto marrón,
// chip con el tipo de pieza, un solo panel abierto y cierre visible.
//
// Uso en index.html:  <a-entity id="ficha" ficha-producto></a-entity>
// Desde el código:
//   ficha.components['ficha-producto'].mostrar(datosDelCatalogo, entidadDeLaPieza);
//   ficha.components['ficha-producto'].ocultar();

import { contenidoFicha, paraFuenteSinTildes as t } from '../datos/textos-pieza.js';

const THREE = AFRAME.THREE;

const ANCHO = 0.95;
const ALTO_MINIMO = 0.62;
const MARGEN = 0.05;
const ANCHO_TEXTO = ANCHO - 2 * MARGEN;
const SEPARACION = 0.018;   // espacio entre bloques de texto (m)

const COLORES = {
  fondo: '#FFF4E6',   // marfil de interfaz
  tinta: '#493021',   // madera oscura / tinta principal
  suave: '#876142',   // tinta secundaria
  boton: '#795A44'    // bronce
};

// Tamaño de letra de cada tipo de texto: ancho de una letra en metros.
// (Pensado para leerse a 1,5–2 m; el diseño pide letra de 18–24 mm a 1,5 m.)
const LETRA = { titulo: 0.030, precio: 0.024, cuerpo: 0.021, aviso: 0.018, chip: 0.016, boton: 0.024 };

// En la fuente de A-Frame (Roboto), cada línea ocupa 1,87 veces el ancho de
// una letra (lineHeight 44,1 / widthFactor 23,6, medido en el navegador).
const ALTO_LINEA = 1.87;

// Cuántas líneas ocupará un texto si caben `letras` caracteres por línea.
// Reparte palabra por palabra, como hace A-Frame. Las mayúsculas son más
// anchas que la media, así que se cuenta con un 10 % de margen.
function contarLineas(texto, letras) {
  const limite = Math.floor(letras * 0.9);
  let total = 0;
  for (const parrafo of texto.split('\n')) {
    let lineas = 1;
    let largo = 0;
    for (const palabra of parrafo.split(' ')) {
      const extra = (largo > 0 ? 1 : 0) + palabra.length;
      if (largo + extra > limite && largo > 0) {
        lineas++;
        largo = palabra.length;
      } else {
        largo += extra;
      }
    }
    total += lineas;
  }
  return total;
}

// Crea una entidad de texto anclada por arriba a la izquierda (o centrada)
function crearTexto(valor, x, y, ancho, letra, color, align = 'left') {
  const el = document.createElement('a-entity');
  el.setAttribute('text', {
    value: valor, color, align, width: ancho, wrapCount: Math.round(ancho / letra),
    anchor: align === 'center' ? 'center' : 'left', baseline: 'top'
  });
  el.setAttribute('position', `${x} ${y} 0.002`);
  return el;
}

AFRAME.registerComponent('ficha-producto', {
  schema: {
    lado: { default: 'derecha', oneOf: ['derecha', 'izquierda'] }, // lado de la pieza
    separacion: { type: 'number', default: 0.85 },  // m, de lado desde el eje de la pieza
    adelanto: { type: 'number', default: 0.45 },    // m, hacia el frente de la pieza
    altura: { type: 'number', default: 1.45 },      // m, centro del panel sobre el suelo
    giro: { type: 'number', default: 15 }           // grados, inclinación hacia la pieza
  },

  init: function () {
    this.el.setAttribute('visible', false);

    // Fondo (su alto se ajusta en cada mostrar)
    this.fondo = document.createElement('a-entity');
    this.fondo.setAttribute('material', { color: COLORES.fondo, shader: 'flat' });
    this.el.appendChild(this.fondo);

    // Contenedor del contenido (se vacía y se rellena en cada mostrar)
    this.contenido = document.createElement('a-entity');
    this.el.appendChild(this.contenido);

    // Botón CERRAR (se coloca abajo a la derecha en cada mostrar)
    this.boton = document.createElement('a-entity');
    this.boton.id = 'cerrarFicha';
    this.boton.setAttribute('geometry', { primitive: 'plane', width: 0.26, height: 0.09 });
    this.boton.setAttribute('material', { color: COLORES.boton, shader: 'flat' });
    this.boton.appendChild(crearTexto('CERRAR', 0, LETRA.boton * ALTO_LINEA / 2, 0.26, LETRA.boton, '#FFFFFF', 'center'));
    this.boton.addEventListener('click', () => this.ocultar());
    this.el.appendChild(this.boton);
  },

  // Rellena la ficha con los datos de una pieza y la coloca junto a ella
  mostrar: function (pieza, elPieza) {
    const c = contenidoFicha(pieza);

    while (this.contenido.firstChild) this.contenido.removeChild(this.contenido.firstChild);

    // Los textos se colocan de arriba abajo. `y` empieza en 0 (borde superior
    // del contenido) y baja según las líneas que ocupa cada bloque.
    let y = 0;
    const izq = -ANCHO_TEXTO / 2;

    // 1. Chip del tipo de pieza (su ancho depende del largo de la etiqueta)
    const etiqueta = t(c.chip.toUpperCase());
    const anchoChip = 0.04 + etiqueta.length * LETRA.chip;
    const altoChip = LETRA.chip * ALTO_LINEA + 0.02;
    const chip = document.createElement('a-entity');
    chip.setAttribute('geometry', { primitive: 'plane', width: anchoChip, height: altoChip });
    chip.setAttribute('material', { color: c.colorChip, shader: 'flat' });
    chip.setAttribute('position', `${izq + anchoChip / 2} ${y - altoChip / 2} 0.001`);
    chip.appendChild(crearTexto(etiqueta, 0, LETRA.chip * ALTO_LINEA / 2, anchoChip, LETRA.chip, '#FFFFFF', 'center'));
    this.contenido.appendChild(chip);

    // 2. Aviso de clasificación ilustrativa, a la derecha del chip y separado de él
    let altoCabecera = altoChip;
    if (c.aviso) {
      const anchoAviso = ANCHO_TEXTO - anchoChip - 0.025;
      const lineas = contarLineas(t(c.aviso), Math.round(anchoAviso / LETRA.aviso));
      this.contenido.appendChild(crearTexto(t(c.aviso), izq + anchoChip + 0.025, y, anchoAviso, LETRA.aviso, COLORES.suave));
      altoCabecera = Math.max(altoChip, lineas * LETRA.aviso * ALTO_LINEA);
    }
    y -= altoCabecera + SEPARACION * 1.5;

    // 3. Bloques de texto uno debajo de otro
    const cuerpo = [...c.detalles, c.descripcion].filter(Boolean).join('\n');
    const bloques = [
      { valor: t(c.titulo.toUpperCase()), letra: LETRA.titulo, color: COLORES.tinta },
      { valor: t(c.precio), letra: LETRA.precio, color: COLORES.suave },
      { valor: t(c.disponibilidad), letra: LETRA.cuerpo, color: COLORES.suave },
      { valor: t(cuerpo), letra: LETRA.cuerpo, color: COLORES.tinta }
    ];
    for (const b of bloques) {
      if (!b.valor) continue;
      this.contenido.appendChild(crearTexto(b.valor, izq, y, ANCHO_TEXTO, b.letra, b.color));
      y -= contarLineas(b.valor, Math.round(ANCHO_TEXTO / b.letra)) * b.letra * ALTO_LINEA + SEPARACION;
    }

    // 4. Alto del panel: contenido + botón + márgenes (mínimo 0,62 m)
    const altoContenido = -y;
    const alto = Math.max(ALTO_MINIMO, MARGEN + altoContenido + 0.09 + 0.02 + MARGEN);
    this.fondo.setAttribute('geometry', { primitive: 'plane', width: ANCHO, height: alto });
    this.contenido.setAttribute('position', `0 ${alto / 2 - MARGEN} 0`);
    this.boton.setAttribute('position', `${ANCHO / 2 - MARGEN - 0.13} ${-alto / 2 + MARGEN + 0.045} 0.004`);

    this.colocarJunto(elPieza);
    this.el.setAttribute('visible', true);
    this.boton.classList.add('interactivo'); // solo se puede pulsar si está visible
  },

  ocultar: function () {
    this.el.setAttribute('visible', false);
    this.boton.classList.remove('interactivo');
  },

  // Coloca el panel al lado de la pieza, como una cartela de museo.
  // La orientación depende SOLO de la pieza (no de dónde esté el visitante),
  // así todas las fichas quedan igual de ordenadas respecto a su pieza.
  colocarJunto: function (elPieza) {
    const posPieza = new THREE.Vector3();
    elPieza.object3D.getWorldPosition(posPieza);

    // "Frente" de la pieza: su eje +Z en el mundo (hacia donde se la mira de frente)
    const giroPieza = new THREE.Quaternion();
    elPieza.object3D.getWorldQuaternion(giroPieza);
    const frente = new THREE.Vector3(0, 0, 1).applyQuaternion(giroPieza).setY(0).normalize();

    // "Derecha" de quien mira la pieza de frente
    const derecha = new THREE.Vector3(frente.z, 0, -frente.x);
    const signo = this.data.lado === 'derecha' ? 1 : -1;

    const pos = posPieza.clone()
      .addScaledVector(derecha, signo * this.data.separacion)
      .addScaledVector(frente, this.data.adelanto);
    pos.y = this.data.altura;

    // Misma orientación que la pieza, girada `giro` grados hacia ella
    // (como la página de un libro abierto junto a la pieza)
    const orientacion = Math.atan2(frente.x, frente.z)
      - signo * THREE.MathUtils.degToRad(this.data.giro);

    this.el.object3D.position.copy(pos);
    this.el.object3D.rotation.set(0, orientacion, 0);
  }
});
