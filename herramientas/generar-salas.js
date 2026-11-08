// GENERAR LOS DATOS DE LAS SALAS - ARTEANC VR (módulo 1.4)
//
// Uso: `npm run salas`
//
// Lee el diseño congelado `docs/diseno/final/02-layout.json` (la fuente de
// verdad, DT-009) y escribe `datos/salas.json`: los mismos datos, con nombres
// en español como el resto del código y solo lo que necesita la escena.
//
// ⚠️ No editar `datos/salas.json` a mano: se sobrescribe. Para cambiar la casa
// se cambia el diseño (como versión nueva, DT-009) y se vuelve a generar.
// `npm run validar` avisa si `datos/salas.json` no coincide con el diseño.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const RUTA_DISENO = 'docs/diseno/final/02-layout.json';
export const RUTA_SALAS = 'datos/salas.json';

// Nombres en español de los tipos de elementos fijos
const TIPOS_ELEMENTO = {
  water_channel: 'canal_agua',
  reception_desk: 'mostrador',
  articulated_lamp: 'lampara_articulada',
  scale_ruler: 'regla_escala',
  magnifier: 'lupa'
};

// Convierte el diseño (claves en inglés) en los datos de la escena (en español)
export function generarSalas(diseno) {
  const a = diseno.architecture;

  return {
    version: 1,
    origen: `${RUTA_DISENO} (diseño congelado v${diseno.version})`,
    nota: 'ARCHIVO GENERADO con `npm run salas`: no editar a mano. Guía: docs/SALAS.md. ' +
      'Unidades en metros; X = este, Y = arriba, norte = −Z; origen en el umbral sur. ' +
      'tamano = medidas LIBRES interiores [ancho X, alto Y, fondo Z] (no restar el muro otra vez).',

    limites: { x: diseno.bounds.x, z: diseno.bounds.z },
    grosorMuro: diseno.wallThickness,
    alturaTecho: a.ordinaryRoofHeight,
    alturaTechoSantuario: a.sanctuaryRoofHeight,
    alturaZocalo: a.baseboardHeight,
    pasoMinimoEntreMuebles: a.minimumFurniturePassage,
    recorrido: diseno.mainRoute,

    salas: diseno.rooms.map((r) => ({
      id: r.id,
      nombre: r.label,
      centro: r.center,           // centro del suelo interior
      tamano: r.size,             // [ancho X, alto Y, fondo Z], medidas libres
      acento: r.accent,           // color de la sala
      cieloAbierto: r.openSky === true,
      papel: r.role === 'circulation' ? 'circulacion' : 'sala'
    })),

    accesos: diseno.doors.map((d) => ({
      id: d.id,
      desde: d.fromRoom,
      hacia: d.toRoom,
      centro: d.center,           // centro en planta, a nivel del suelo, en medio del espesor del muro
      // 'h': el muro corre de este a oeste (se cruza yendo norte-sur); 'v': corre de norte a sur
      muro: d.wallDirection === 'h' ? 'este-oeste' : 'norte-sur',
      forma: d.shape === 'trapezoid' ? 'trapecio' : d.shape,
      anchoBase: d.clearWidth,
      anchoSuperior: d.clearTopWidth,
      alto: d.clearHeight,
      fondo: d.depth,
      modulo: d.moduleSize,       // pieza de muro que contiene el hueco [X, Y, Z]
      conPuerta: d.leaf === true  // false: todos los huecos son abiertos
    })),

    posiciones: diseno.exhibitSlots.map((s) => {
      const p = {
        id: s.id,
        sala: s.sala,
        tipo: s.tipo,               // peana, vitrina, mesa u hornacina
        apoyo: s.position,          // centro de la SUPERFICIE donde se apoya la pieza (no la base del mueble)
        orientacion: s.orientation, // grados [X, Y, Z]; Y: 0 mira al sur (+Z), 90 al este, 180 al norte, 270 al oeste
        tamanoSoporte: s.supportSize,
        altoPieza: s.objectHeight,  // alto de referencia de la pieza del diseño (no del producto)
        cartela: {
          tamano: s.label.size,
          centro: s.label.position,
          orientacion: s.label.orientation,
          enMuro: s.label.wallMounted === true
        }
      };
      if (s.panelSize) p.tamanoPanel = s.panelSize;
      if (s.presentation) p.presentacion = s.presentation;
      return p;
    }),

    elementos: diseno.fixtures.map((f) => {
      const e = {
        id: f.id,
        tipo: TIPOS_ELEMENTO[f.type] ?? f.type,
        sala: f.room,
        centro: f.center,
        tamano: f.size
      };
      if (f.waterLevel !== undefined) e.nivelAgua = f.waterLevel;
      if (f.navigable !== undefined) e.transitable = f.navigable;
      if (f.accessibleSectionHeight !== undefined) e.alturaTramoAccesible = f.accessibleSectionHeight;
      if (f.temperatureK !== undefined) e.temperaturaLuzK = f.temperatureK;
      return e;
    }),

    arquitectura: {
      portalSantuario: {
        acceso: a.portal.id,
        limites: a.portal.moduleBounds,
        anchoBase: a.portal.openingBaseWidth,
        anchoSuperior: a.portal.openingTopWidth,
        alto: a.portal.openingHeight
      },
      cierreNorte: {
        pantallaPatioZ: a.northClosure.patioScreenCenterZ,
        pantallaGrosor: a.northClosure.screenThickness,
        pantallaAlto: a.northClosure.screenHeight,
        pantallaTramosX: a.northClosure.screenXRanges,
        muroSurSantuarioZ: a.northClosure.sanctuarySouthWallCenterZ,
        muroSurSantuarioTramosX: a.northClosure.sanctuarySouthWallXRanges,
        retranqueoNoTransitable: a.northClosure.nonNavigableRecessDepth
      },
      galeriaSur: {
        aperturaAlPatio: a.southGallery.openConnectionToPatio,
        bordesCerradosX: a.southGallery.closedSideEdgesX,
        muroLateralAlto: a.southGallery.sideWallHeight,
        muroLateralGrosor: a.southGallery.sideWallThickness,
        muroSurZ: a.southGallery.southBoundaryWallZ
      },
      hornacina: {
        modulo: a.niche.moduleSize,
        anchoBase: a.niche.openingBaseWidth,
        anchoSuperior: a.niche.openingTopWidth,
        alto: a.niche.openingHeight,
        fondo: a.niche.openingDepth,
        alturaRepisa: a.niche.shelfHeight,
        forroSantuario: a.niche.sanctuaryLining,
        forroTaller: a.niche.workshopLining
      },
      ranuraCenital: {
        sala: diseno.skylight.room,
        centro: diseno.skylight.center,
        tamano: diseno.skylight.size
      }
    }
  };
}

export function leerDiseno() {
  return JSON.parse(readFileSync(RUTA_DISENO, 'utf8'));
}

// JSON con sangría, pero las listas simples (coordenadas, medidas) en una línea:
// [-9.4, 0, -14] en vez de cinco líneas. Más fácil de leer y de comparar.
export function textoSalas(salas) {
  const texto = JSON.stringify(salas, null, 2)
    .replace(/\[\s+([^[\]{}]*?)\s+\]/g, (_, dentro) => `[${dentro.split(/,\s+/).join(', ')}]`);
  return texto + '\n';
}

// Si se ejecuta directamente (`npm run salas`), escribe el archivo
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const salas = generarSalas(leerDiseno());
  writeFileSync(RUTA_SALAS, textoSalas(salas));
  console.log(`✓ ${RUTA_SALAS} generado: ${salas.salas.length} salas, ${salas.accesos.length} accesos, ` +
    `${salas.posiciones.length} posiciones, ${salas.elementos.length} elementos`);
}
