# Fuentes MSDF de ArteAnc VR

Tipografías del diseño final (DISENO_FINAL.md §7), convertidas a **MSDF**
(*multi-channel signed distance field*) para que A-Frame las dibuje nítidas a
cualquier distancia, con **tildes, eñes y signos españoles**.

| Archivo | Uso |
|---|---|
| `Inter.json` + `Inter.png` | Textos, datos, estados y botones (fuente por defecto) |
| `CormorantGaramond.json` + `CormorantGaramond.png` | Títulos y marca |
| `*-OFL.txt` | Licencias (SIL Open Font License 1.1: uso libre, también comercial) |
| `caracteres.txt` | Los 126 caracteres incluidos: ASCII + `áéíóúÁÉÍÓÚñÑüÜ¿¡°×·–—“”‘’«»€…ºª` |

Se usan desde `src/escena/fuentes.js` (`shader: msdf`, `negate: false`).

## Cómo regenerarlas (si hace falta un carácter nuevo)

El generador **no** está en el proyecto (sus dependencias son antiguas y
traen avisos de seguridad; solo hace falta una vez). Desde una carpeta aparte:

```powershell
mkdir C:\temp\fuentes-msdf; cd C:\temp\fuentes-msdf
npm init -y
npm install msdf-bmfont-xml@2.8.0
# copiar aquí caracteres.txt (añadir el carácter nuevo) y luego:
npx msdf-bmfont -f json -s 48 -r 4 -t msdf --pot --smart-size -i caracteres.txt -o Inter C:\arteanc\ArteAnc-VR\docs\diseno\final\fuentes\Inter.ttf
npx msdf-bmfont -f json -s 48 -r 4 -t msdf --pot --smart-size -i caracteres.txt -o CormorantGaramond C:\arteanc\ArteAnc-VR\docs\diseno\final\fuentes\CormorantGaramond.ttf
```

Copiar los `.json` y `.png` resultantes a esta carpeta. Si cambian `-s` o la
fuente, volver a medir `ALTO_LINEA` en `src/componentes/ficha-producto.js`
(lineHeight / widthFactor; hoy 58 / 28,5 = 2,035).
