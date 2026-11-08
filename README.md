# ArteAnc VR

Tienda-museo virtual de **ArteAnc** (arte andino y precolombino) para Meta Quest 3
y navegadores de escritorio, construida con [A-Frame](https://aframe.io/) y WebXR.

- **Diseño:** "La Casa ArteAnc", una casa andina con patio central y el
  Santuario precolombino como sala principal → [docs/diseno/](docs/diseno/README.md)
- **Plan de desarrollo:** [docs/PLAN_MAESTRO.md](docs/PLAN_MAESTRO.md)
- **Documentación completa:** [docs/README.md](docs/README.md)
- **Registro de avances:** [docs/BITACORA.md](docs/BITACORA.md)

## Probar en local
La primera vez, instalar las dependencias (requiere Node.js):
```
npm install
```
Después, cada vez que se trabaje:
```
npm run dev        # servidor local en http://localhost:5173 con recarga automática
npm run build      # genera la versión publicable en dist/
npm run preview    # prueba esa versión publicable en http://localhost:4173
```
