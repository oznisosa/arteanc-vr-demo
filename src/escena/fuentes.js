// FUENTES CON TILDES Y EÑES - ARTEANC VR (módulo 1.5)
//
// La fuente que trae A-Frame no tiene tildes ni eñes. Desde el módulo 1.5 se
// usan las tipografías del diseño final (DISENO_FINAL.md §7), convertidas a
// MSDF (ver fuentes/LEEME.md):
//   - Inter: textos, datos, estados y botones (fuente por defecto de TODOS los textos);
//   - Cormorant Garamond: títulos y marca.
//
// Al importar este archivo se cambia el valor por defecto del componente
// `text` de A-Frame. Debe importarse ANTES de que se creen las entidades
// (por eso es lo primero que importan main.js y casa.js).

export const FUENTES = {
  texto: './fuentes/Inter.json',
  titulo: './fuentes/CormorantGaramond.json'
};

const esquema = AFRAME.components.text.schema;
esquema.font.default = FUENTES.texto;
// Nuestras fuentes son MSDF (3 canales de color). A-Frame usa por defecto el
// sombreador 'sdf' (1 canal): con él las letras salen como bloques macizos.
esquema.shader.default = 'msdf';
// Las fuentes de msdf-bmfont-xml no van invertidas
esquema.negate.default = false;
