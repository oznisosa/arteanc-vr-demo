# Diseño de La Casa ArteAnc

| Carpeta | Contenido | Estado |
|---|---|---|
| [final/](final/) | **Diseño final congelado v1.0**: planta, `02-layout.json`, axonometría, 8 vistas, 5 interfaces, kit, especificación y control de calidad | **Referencia oficial para construir** (DT-009) |
| [referencias/prototipo-1/](referencias/prototipo-1/) | Prototipo 1 "Santuario andino contemporáneo": manual, guía de implementación, layout y contrato de datos originales, concepto A | Histórico; su contenido útil ya está en `final/` |
| [referencias/prototipo-2/](referencias/prototipo-2/) | Prototipo 2 "La Casa ArteAnc": README con las láminas descritas, planta SVG y moodboard | Histórico; su contenido útil ya está en `final/` |
| [encargos/](encargos/) | Prompts enviados a ChatGPT para producir los diseños | Histórico |

## Regla principal
**`final/02-layout.json` y `final/01-planta.svg` mandan sobre las imágenes.**
Las perspectivas definen el ambiente; las coordenadas salen del JSON. La
especificación completa está en [final/DISENO_FINAL.md](final/DISENO_FINAL.md).

## Cómo ver las láminas
Abre `final/index.html` en el navegador (funciona sin servidor).

## Cambios hechos al incorporar la entrega (2026-11-08)
- Las 8 perspectivas `04a`–`04h` se convirtieron de PNG (~2,3 MB) a **JPG**
  (~230 KB) para no inflar el repositorio. Se actualizaron sus referencias en
  `index.html` y `DISENO_FINAL.md`. Por eso `MANIFIESTO_SHA256.json` ya no
  coincide con esos 8 archivos; el resto sí.
- `fuentes-graficas/` (SVG editables de axonometría y kit, ~6 MB) y los
  borradores de ChatGPT no se subieron. Están en `_archivo/diseno-final-entrega/`
  en el equipo local (carpeta ignorada por Git), junto con el ZIP original.
- En `referencias/`, los README de los prototipos mencionan imágenes que no se
  copiaron. Los paquetes completos están en `Descargas/prototipo 1` y
  `Descargas/prototipo 2` del equipo de Ozni.
- `final/fuentes/` contiene Cormorant Garamond e Inter (licencia OFL). Se usarán
  para generar las fuentes MSDF con tildes (Fase 1).
