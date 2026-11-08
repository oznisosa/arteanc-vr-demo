# ArteAnc VR

Tienda-museo virtual de **ArteAnc** (arte andino y precolombino) para Meta Quest 3
y navegadores de escritorio, construida con [A-Frame](https://aframe.io/) y WebXR.

- **Diseño:** "La Casa ArteAnc", una casa andina con patio central y el
  Santuario precolombino como sala principal → [docs/diseno/](docs/diseno/README.md)
- **Plan de desarrollo:** [docs/PLAN_MAESTRO.md](docs/PLAN_MAESTRO.md)
- **Documentación completa:** [docs/README.md](docs/README.md)
- **Registro de avances:** [docs/BITACORA.md](docs/BITACORA.md)

## Probar en local
En Windows, si PowerShell responde "la ejecución de scripts está deshabilitada",
ejecutar una sola vez:
```
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```
(o usar `npm.cmd` en lugar de `npm`).

La primera vez, instalar las dependencias (requiere Node.js):
```
npm install
```
Después, cada vez que se trabaje:
```
npm run dev        # servidor local en http://localhost:5173 con recarga automática
npm run quest      # igual, pero con HTTPS y abierto a la red local, para el Quest 3
npm run build      # genera la versión publicable en dist/
npm run preview    # prueba esa versión publicable en http://localhost:4173
```
Añadir `?debug` a la dirección (p. ej. `http://localhost:5173/?debug`) muestra el
medidor de rendimiento: fps, llamadas de dibujo y triángulos (también dentro del visor).

## Probar en el Meta Quest 3 (por wifi)
1. El PC y el Quest deben estar en la **misma red** (mismo router).
2. En el PC: `npm run quest`. En la terminal aparece una línea
   `Network: https://192.168.x.x:5173/`.
3. Si Windows pregunta por el firewall, **permitir el acceso en redes privadas**.
4. En el navegador del Quest, escribir esa dirección **con `https://`**.
5. Aparecerá un aviso de conexión no privada (el certificado es de prueba):
   **Configuración avanzada → Continuar a 192.168.x.x**.
6. Pulsar el botón **VR** de la escena.
