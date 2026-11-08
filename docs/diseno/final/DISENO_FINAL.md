# La Casa ArteAnc — Diseño final congelado v1.0

**Referencia de construcción de la escena virtual · 8 de noviembre de 2026**

La casa andina del Prototipo 2 organiza la visita alrededor de un patio abierto. El Santuario precolombino del concepto A del Prototipo 1 ocupa el extremo norte y es el único espacio monumental. Todas las piezas representadas son ilustrativas y no vendibles; ninguna imagen acredita una atribución, una fecha, una procedencia o un inventario comercial.

**La planta y el layout.json mandan sobre las imágenes.** En este paquete, esos archivos son `01-planta.svg` / `01-planta.png` y `02-layout.json`. Las imágenes de ambiente no autorizan a añadir accesos, mover salas ni alterar las cotas. El JSON fija las posiciones de apoyo de las piezas y las cámaras de referencia. Este congelado sustituye las distribuciones anteriores; no congela todavía inventario, modelos de producto, precios ni rendimiento en visor.

## 1. Coordenadas y espacios

Una unidad es un metro. Origen `[0, 0, 0]` en el centro del umbral de entrada sur. **X positivo = este; Y positivo = arriba; norte = −Z.** Todo el suelo transitable está a `y = 0`, sin peldaños. La geometría de los recintos es simétrica sobre `x = 0`; las funciones, colores y muebles responden a cada sala y no son una copia especular.

Los límites siguientes corresponden a caras interiores terminadas. Los muros tienen **0,40 m** y se sitúan fuera de esas medidas libres; los muros compartidos se construyen una sola vez. En `rooms`, `center` es el centro del suelo, con `y = 0`, y `size` conserva el orden del Prototipo 1: **`[ancho X, alto Y, fondo Z]`**. En las tablas legibles se usa ancho × fondo × alto.

| Espacio / ID | Centro `[X,Y,Z]` m | Límites libres X m | Límites libres Z m | Ancho × fondo × alto m | Acento |
|---|---|---|---|---|---|
| Umbral / Recepción · `recepcion` | `[0,0,-3.20]` | −4 a 4 | −6,20 a −0,20 | 8 × 6 × 4 | Madera `#A98158` |
| Metal, piedra e instrumentos · `metal` | `[-8.40,0,-3.20]` | −12,40 a −4,40 | −6,20 a −0,20 | 8 × 6 × 4 | Índigo `#344660`, dorado `#B4975A` |
| Taller / Mesa de examen · `taller` | `[8.40,0,-3.20]` | 4,40 a 12,40 | −6,20 a −0,20 | 8 × 6 × 4 | Ocre neutro `#A88B61` |
| Galería sur del patio · `galeria_sur` | `[0,0,-7.60]` | −12,40 a 12,40 | −8,60 a −6,60 | 24,80 × 2; cielo abierto | Piedra `#D5C5B0` |
| Patio central · `patio` | `[0,0,-14]` | −5 a 5 | −19 a −9 | 10 × 10; cielo abierto | Piedra `#D5C5B0` |
| Cerámica · `ceramica` | `[-9.40,0,-14]` | −13,40 a −5,40 | −19 a −9 | 8 × 10 × 4 | Terracota `#B96645` |
| Textiles · `textiles` | `[9.40,0,-14]` | 5,40 a 13,40 | −19 a −9 | 8 × 10 × 4 | Cochinilla `#9E3441` |
| Santuario precolombino · `santuario` | `[0,0,-25.20]` | −6 a 6 | −30,20 a −20,20 | 12 × 10 × 6,50 | Bronce `#795A44`, basalto `#302A27` |

Envolvente máxima: `x = [-13.80,13.80]`, `z = [-30.60,0.20]`, **27,60 × 30,80 m**, de contorno escalonado. No es un rectángulo íntegramente ocupado. `size.y = 4` en patio y galería sur representa la altura de sus límites ordinarios, **no una cubierta**; `openSky = true` prevalece.

### Resoluciones de coordinación

1. **Tres salas sur frente a un patio de 10 m.** Sus anchos libres y dos separaciones de 0,40 m suman 24,80 m. Manteniendo recepción centrada, cada sala lateral sólo tendría 0,60 m de coincidencia con el frente de un patio de 10 m: no cabe un hueco de 1,60 m. Se añade la **galería sur abierta de distribución de 2 m libres**, prolongación del espacio exterior del patio. Cada sala sur tiene su propio portal hacia ella, sin atravesar otra sala. Es la única ampliación de circulación respecto del programa; el núcleo del patio conserva sus 10 × 10 m.
2. **Espesor de muros en esa galería.** Las alas y el núcleo norte se desplazaron 0,40 m al norte antes del congelado. Los muros sur de Cerámica y Textiles ocupan `z = [-9,-8.60]` y la galería conserva íntegros sus 2 m entre `-8.60` y `-6.60`. La banda central `x = [-5,5]`, `z = [-9,-8.60]` une patio y galería sin muro ni desnivel. Los extremos laterales de la galería están cerrados.
3. **Paso de 1,80 m frente a accesos de 1,60 m.** El mínimo de 1,80 m se exige entre muebles y sobre las rutas de circulación; los huecos normales son estrechamientos puntuales fijados por el encargo, con 1,60 m en la base y 1,30 m arriba. No se ensanchan silenciosamente. La navegación tendrá destinos seguros a ambos lados, por validar en Quest 3.
4. **Portal profundo y muros de 0,40 m.** D07 tiene una sola abertura continua de 1,20 m de profundidad, con jambas laterales que cierran el paso. La pantalla norte del patio y el muro sur del Santuario mantienen 0,40 m; los retranqueos laterales entre ambas caras quedan fuera del recorrido, sin accesos adicionales.
5. **Cuota de piezas al sur.** Se interpreta como cuota de las salas expositivas Metal y Taller: seis piezas en cada una. Recepción permanece dedicada a bienvenida, tutorial y favoritos, sin piezas adicionales que estrechen el eje. Esta interpretación queda explícita para la revisión posterior.
6. **Textiles y tipos de soporte.** Se conservan los cuatro tipos de `exhibitSlots` solicitados. Seis peanas incorporan un portapanel textil y dos mesas presentan muestras inclinadas; `presentation` distingue esas variantes sin inventar un quinto tipo de slot.

## 2. Accesos y recorrido

Todos los accesos son **marcos trapezoidales abiertos de sillería, sin hojas, herrajes ni paneles que cierren el paso**. En el JSON, `wallDirection: h` indica muro de este a oeste; `v`, muro de norte a sur. Los centros están a nivel del suelo y en el centro del espesor del paso.

| ID | Conexión | Centro `[X,Y,Z]` m | Base / parte alta / altura / profundidad m |
|---|---|---|---|
| D01 | Exterior → Recepción | `[0,0,0]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D02 | Recepción → Galería sur del patio | `[0,0,-6.40]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D03 | Metal → Galería sur del patio | `[-8.40,0,-6.40]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D04 | Taller → Galería sur del patio | `[8.40,0,-6.40]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D05 | Patio → Cerámica | `[-5.20,0,-14]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D06 | Patio → Textiles | `[5.20,0,-14]` | 1,60 / 1,30 / 2,60 / 0,40 |
| D07 | Patio → Santuario | `[0,0,-19.60]` | 2,40 / 1,90 / 4,20 / 1,20 |

El paso D07 ocupa `z = [-20.20,-19]`, sin una segunda puerta interior. No hay salida, ventana o paisaje en el muro norte del Santuario. La ranura cenital es la abertura luminosa principal.

Recorrido sugerido: recepción → patio → Cerámica → patio → Textiles → patio y galería sur → Metal → galería sur → Taller → patio → Santuario → patio → recepción/favoritos. Se puede escoger cualquier sala desde el mapa. El Santuario es el remate visual y narrativo, no una etapa obligatoria para acceder a una pieza o a la tienda. Las franjas de color conducen a cada acceso; la forma, el nombre y la ubicación complementan el color.

La peana **P01** tiene superficie de apoyo `[0,1,-11.40]`. El canal se sitúa al norte, centrado en `[0,0.175,-14.60]`, con envolvente exterior **0,50 × 4 × 0,35 m** (ancho × largo × alto), borde incluido; su superficie de agua plana está a `y = 0,28`. Se rodean ambos por los lados. No se teletransporta encima de ellos ni se interpreta el eje visual como un pasillo libre continuo.

## 3. Exhibición y escala humana

| Sala | IDs | Soportes | Total |
|---|---|---|---|
| Cerámica | C01–C08 | 6 peanas + 2 vitrinas | 8 |
| Textiles | T01–T08 | 6 peanas portapanel + 2 mesas | 8 |
| Metal, piedra e instrumentos | M01–M06 | 4 peanas + 2 vitrinas | 6 |
| Taller | W01–W06 | 4 peanas + 1 hornacina encalada + 1 mesa de examen | 6 |
| Santuario | S01–S09 | 6 hornacinas de bronce + 3 peanas de basalto | 9 |
| Patio | P01 | 1 peana, pieza de la semana | 1 |
| Recepción / galería sur | — | Mostrador / circulación | 0 |

**Total: 38 posiciones de exhibición.** La capacidad de la escena no autoriza a completar el catálogo con productos inventados. Las coordenadas individuales y las cartelas figuran en la planta y en `exhibitSlots`.

- Ojos de referencia: 1,60 m de pie; 1,20 m sentado. Las vistas 04a–04h fijan la cámara a 1,60 m; en uso real se respeta el seguimiento y la calibración del visitante.
- Peanas: 0,50 × 0,50 m de planta; altura nominal 1 m, con variantes 0,90–1,05 m. Santuario en basalto; resto en piedra clara. Vitrinas: 0,60 × 0,60 × 1,60 m, superficie de apoyo a 0,90 m, vidrio sencillo.
- Piezas pequeñas: centro visual entre 1,10 y 1,40 m. Los volúmenes de referencia de 0,40 m apoyados a 0,90–1 m cumplen esta intención. Son dimensiones de la ilustración, no medidas publicables de un producto.
- Textiles: seis muestras de 0,45 × 0,60 m sobre portapanel, con centro a 1,20 m; dos mesas de 1,20 × 0,60 × 0,90 m. Los diseños son composiciones ilustrativas sin iconografía sagrada.
- Cartela: 0,50 × 0,35 m; inclinación nominal de **25° sobre la horizontal**, equivalente a una rotación X de −65° desde un panel vertical, con posición y orientación en cada slot. Las cartelas de hornacinas se fijan al muro sin tratar su proyección como nula, y la de examen permanece sobre la mesa. En el Santuario se sitúan bajo los huecos, con centro a 0,80 m. La huella de cada puesto incluye sus elementos anexos al comprobar recorridos.
- Santuario: tres hornacinas por muro lateral, a `z = -22.40, -25.40, -28.40`, apoyo a 1 m. Las peanas S07, S08 y S09 están en esas mismas coordenadas Z sobre `x = 0`. La ranura se extiende entre `z = -28.90` y `-21.90`, por lo que la última peana queda bajo ella.
- Taller: mesa W06 de 3 × 1,20 × 0,90 m en `[8.40,0.90,-3.20]`, con foco articulado de luz rasante, lupa y regla de escala. El examen manipula una copia restaurable; no desplaza de forma permanente la pieza de exposición.
- Recepción: mostrador de 2,60 × 0,90 × 1 m, centro geométrico `[-2.35,0.50,-3.60]`, al oeste del eje, con sección de atención a 0,75 m. La ficha de favoritos se abre aquí o mediante una acción explícita de interfaz.

La comprobación geométrica entre huellas de apoyos y cartelas arroja mínimos de **1,80 m en Cerámica, 1,85 m en Textiles, 1,85 m en Metal, 1,99 m en Taller y 2,20 m en Santuario**. Se incluyó la proyección horizontal de las cartelas inclinadas; los elementos apoyados sobre la mesa no se contaron como muebles separados. Esta comprobación no mide distancias a muros ni certifica una malla de navegación. En el patio, la separación de 0,95 m entre peana y canal **no es un paso**: forman un conjunto axial que se rodea por los laterales, con hasta 4,75 m entre su borde y cada muro. La navegación debe excluir también ese intervalo central.

## 4. Paleta y materiales

Los valores de rugosidad son puntos de partida de material, en escala 0–1. Los códigos hex fijan colores base de material e interfaz, no el valor de cada píxel después de iluminación y sombras. La evaluación final depende de la iluminación horneada y del visor. Las superficies no deben parecer mojadas ni reflejar con nitidez la arquitectura.

| Token / material | Hex | Rugosidad sugerida | Aplicación |
|---|---|---:|---|
| Piedra clara | `#D5C5B0` | 0,85 | Sillería, pavimento mate, zócalos, peanas ordinarias |
| Adobe encalado | `#E9E0D2` | 0,95 | Paños de la casa, hornacina del taller |
| Madera clara | `#A98158` | 0,80 | Mostrador y mesa de examen |
| Madera oscura / tinta principal | `#493021` | 0,85 | Vigas, estructura de muebles; texto de la interfaz |
| Marfil de interfaz | `#FFF4E6` | 1,00 / panel opaco | Fichas y cartelas; luminancia uniforme |
| Papel de las láminas | `#FAF7F1` | No aplica | Fondo editorial del plano y del kit |
| Terracota | `#B96645` | 0,90 | Franja de Cerámica y acentos UI |
| Cochinilla | `#9E3441` | 0,95 | Franja de Textiles y tejidos mates |
| Índigo | `#344660` | 0,90 | Franja de Metal, piedra e instrumentos |
| Dorado mate | `#B4975A` | 0,70 | Detalle secundario contenido en sala de Metal |
| Ocre neutro | `#A88B61` | 0,90 | Orientación hacia el Taller |
| Bronce cepillado | `#795A44` | 0,65 | Forro de hornacinas del Santuario |
| Basalto | `#302A27` | 0,85 | Peanas del Santuario |
| Ámbar | `#E8B36C` | No aplica a la luz | Acentos luminosos del Santuario, emisión contenida |
| Foco interactivo | `#246F6A` | No aplica a UI | Contorno de selección más icono y texto |
| Agua plana | `#A8BCB9` | 0,85 | Plano estático del canal, sin refracción ni reflexión de escena |

Las juntas de piedra y la textura del encalado deben permanecer legibles sin un microdetalle que parpadee. El zócalo ordinario alcanza **0,80 m**. La luz ámbar se concentra en arquitectura y nichos; el objeto de examen se compara bajo luz neutra. No se añaden sofás, alfombras, plantas decorativas, estanterías de hotel, ventanales con paisaje, superficies pulidas ni personas.

## 5. Luz y atmósfera

Hora visual única: **final de la tarde, cálida y natural**, cielo despejado de degradado suave, sin nubes de atardecer dramático. Esta condición se mantiene en todas las perspectivas. El kit utiliza una presentación editorial uniforme de materiales, sin simular otra hora del día.

| Espacio | Tratamiento fijado | Construcción prevista |
|---|---|---|
| Recepción | Luz natural del patio más apoyo cálido suave, unos 3000 K | Rebotes y sombras horneados; texto sin reflejos |
| Galería sur / patio | Cielo abierto; sol cálido suave y sombras legibles | Luz fija precalculada; canal con un plano de agua estático |
| Cerámica | Galería suave, acentos puntuales de unos 3000 K | Iluminación arquitectónica horneada |
| Textiles | Luz cálida distribuida sin destellos ni sombras duras sobre el tejido | Iluminación horneada; conservar legibilidad de los colores |
| Metal, piedra e instrumentos | Luz suave y puntos cálidos de unos 3000 K | Reflejos contenidos, sin luces o reflejos complejos por pieza |
| Taller | Examen neutro, unos 4000 K, más foco articulado de luz rasante | Ambiente horneado; foco móvil sólo si su coste se valida; alternativa de orientaciones precalculadas |
| Santuario | Mayor penumbra; ranura como luz principal; nichos en ámbar | Contraste horneado, sin haces volumétricos, niebla ni bloom necesario para leer |

Ranura longitudinal: **0,60 × 7 m**, centrada en `[0,6.50,-25.40]`, eje norte–sur, espesor de cubierta de referencia 0,40 m. La altura libre del Santuario es 6,50 m. La luz se expresa como claridad sobre superficies y piezas, sin una columna visible de partículas. Los valores Kelvin son objetivos de apariencia, no mediciones de la escena entregada.

## 6. Kit de construcción

Orden de cotas de esta tabla: **ancho × profundidad × alto**, salvo donde se indique. El kit es un despiece para modelado virtual; las juntas se ajustan a los límites libres del JSON.

| Módulo | Dimensiones m | Condición |
|---|---|---|
| Muro ordinario | 2 × 0,40 × 4 | Adobe o sillería; zócalo de 0,80 m |
| Esquina | Envolvente 0,80 × 0,80 × 4 | Brazos de 0,40 m; sin duplicar muros compartidos |
| Acceso normal abierto | Módulo 2 × 0,40 × 4 | Hueco base 1,60 / arriba 1,30 / alto 2,60; sin hoja |
| Hornacina de la casa | Módulo 1,20 × 0,40 × 2,40 | Hueco base 0,80 / arriba 0,65 / alto 1,20 / profundidad 0,25; apoyo a 1 m |
| Viga | Largo 4 × ancho 0,20 × alto 0,30 | Madera oscura mate, repetición modular |
| Peana ordinaria | 0,50 × 0,50 × 1 | Piedra; variantes 0,90–1,05 m de alto |
| Vitrina | 0,60 × 0,60 × 1,60 | Base de 0,90 m, vidrio sencillo |
| Portal monumental | Envolvente 3,60 × 1,20 × 6,50 | Hueco base 2,40 / arriba 1,90 / alto 4,20; un paso profundo sin hojas |
| Hornacina de bronce | Módulo 1,20 × 0,40 × 2,40 | Mismo hueco de hornacina; forro de bronce, apoyo a 1 m; seis unidades |
| Peana de basalto | 0,50 × 0,50 × 1 | Tres unidades sobre el eje del Santuario |
| Ranura cenital | Ancho X 0,60 × largo Z 7 | Techo a 6,50 m; espesor de referencia 0,40 m |

Complementos dimensionados: cartela 0,50 × 0,35 m; mesa textil 1,20 × 0,60 × 0,90 m; mesa de examen 3 × 1,20 × 0,90 m; mostrador 2,60 × 0,90 × 1 m con sección de 0,75 m; canal exterior 0,50 × 4 × 0,35 m. El acabado de un portal ordinario no se vuelve monumental para diferenciar una sala: se conserva su geometría y cambia el acento.

## 7. Interfaz, tipos de pieza y navegación

**Cormorant Garamond** para títulos y marca tipográfica; **Inter** para datos, estados, cartelas y controles. Las fichas son paneles marfil opacos con texto marrón y contornos discretos. No se superpone un párrafo sobre la textura de una pared.

La cartela muestra nombre, chip de tipo y una acción para abrir la ficha. La ficha ampliada presenta tipo de pieza, dimensiones conocidas, material, disponibilidad, precio con moneda, favorito y acción comercial. En el Santuario, el tipo ocupa una posición especialmente visible y se añade **Historia y fuentes**. Si no existe documentación, se muestra **“Sin fuentes verificadas”** y no se completa la historia con inferencias.

| Valor de datos | Etiqueta visible | Regla editorial |
|---|---|---|
| `original_documentado` | Original documentado | Requiere documentación revisada de esa pieza; el nombre de la sala no basta |
| `replica` | Réplica | Distinguir el objeto reproducido de una atribución al objeto que se vende |
| `artesania_contemporanea` | Artesanía contemporánea | No atribuye por sí sola cultura, fecha exacta ni procedencia |
| `null` | Sin clasificación verificada | No elegir un tipo plausible; detener publicación de ficha comercial hasta revisión |

En las maquetas, los chips son ejemplos de clasificación de objetos ilustrativos, marcados como tales; no certifican productos reales. El Santuario usa **Réplica** y las demás salas **Artesanía contemporánea**, siempre acompañadas por la indicación de demostración o clasificación ilustrativa. En las perspectivas se abrevia “Réplica · demo”; en la interfaz, el chip y el aviso aparecen separados. `illustrative: true` permanece activo en todos los slots. Esta clasificación de la maqueta no se traslada automáticamente a un producto comercial.

La ficha se ancla junto al puesto, aproximadamente a 20° del eje visual, con opción de invertir lado. Un solo panel principal abierto, cierre visible y restauración del foco. Distancia de lectura inicial de 1,5–2 m; altura y escala ajustables para uso sentado. Los tamaños de partida heredados del Prototipo 1 son panel de 0,95 × 0,62 m, texto de 18–24 mm a 1,5 m y botones de al menos 80 × 50 mm con 15 mm de separación. Son hipótesis de prueba: las láminas editoriales no demuestran comodidad en VR.

Tutorial: apuntar y soltar la palanca izquierda para teletransporte; palanca derecha para giro de **30°**; agarre para tomar una copia de las piezas habilitadas. Al soltar, la copia se restablece de forma previsible. No se mueve la cámara mediante una animación de bienvenida. Modo sentado, texto ampliable, subtítulos y control de audio; alternativa de teclado/ratón con foco visible y Escape para cerrar.

Favoritos es una selección local persistente. No equivale a un carrito confirmado por la tienda. Al abrir la tienda se conserva la selección, se explica la salida de XR y se permite cancelar. Si la ventana se bloquea, se ofrece un enlace accesible fuera de XR; un QR puede ser complementario, nunca la única vía.

## 8. Contrato de datos y estados

Se mantiene el contrato del Prototipo 1: `sku`, `titulo`, `naturaleza`, `material`, `dimensiones_m`, `fuentes`, `estadoEditorial`, `moneda`, `precio`, `precioEsFicticio`, `stock`, `urlProducto`, `modelos.galeria`, `modelos.examen`, `actualizadoEn`. El archivo anexo `producto_ejemplo.json` conserva esos campos y añade la clasificación visible y su carácter ilustrativo.

**`null` significa desconocido, no cero, no gratis y no agotado.** `stock: 0` significa agotado; `stock: null` no permite afirmar disponibilidad. Un modelo escalado para caber en el render no autoriza a publicar dimensiones reales. `precioEsFicticio: true` exige rotular “Precio ficticio” y desactivar la compra. El valor USD 120 sirve sólo para probar la interfaz. La tienda es la autoridad de precio y stock vigentes; no se ha verificado aquí una API de catálogo o carrito.

| Estado | Mensaje / comportamiento | Acción comercial |
|---|---|---|
| Cargando | Indicador y estructura estable; no mostrar valores anteriores como actuales | Desactivada mientras no haya datos vigentes |
| Disponible | Mostrar precio, moneda y disponibilidad comprobados | Abrir URL verificada por gesto explícito; volver a comprobar en tienda |
| Agotado | Etiqueta textual visible; conservar historia y examen cuando existan | No ofrecer una incorporación que prometa stock |
| Error | Explicar fallo de consulta y ofrecer reintentar | No inventar precio o stock; consulta de tienda sólo con URL verificada |
| Sin conexión | Distinguir datos locales de datos actuales; mantener navegación y favoritos locales | Desactivada sin verificación; reintentar al recuperar conexión |

### Compatibilidad de `02-layout.json`

Se conservan las claves originales `version`, `units`, `axes`, `bounds`, `wallThickness`, `note`, `rooms`, `doors`, `mainRoute` y `shortRoute`. `rooms` conserva `id`, `label`, `center`, `size` y `phase`; `doors`, `center`, `wallDirection` y `clearWidth`. Las extensiones añaden IDs, conexiones, dimensiones trapezoidales, ausencia de hojas, fixtures, cámaras y slots.

La estructura es compatible como extensión, pero **la semántica de `rooms.size` cambia de cotas nominales a ejes a cotas libres**, por exigencia del diseño final. No reutilizar un constructor antiguo que reste otra vez el espesor de los muros.

`exhibitSlots.position = [x,y,z]` es el centro de la **superficie donde se apoya la pieza**, no el centro ni la base del mueble. `supportSize` usa `[X,Y,Z]`. `orientation` expresa grados Euler `[X,Y,Z]`; yaw 0 mira a +Z/sur, 90 a +X/este, 180 a −Z/norte y 270 a −X/oeste. Las hornacinas se alojan en el espesor del muro, por lo que sus centros de apoyo pueden quedar fuera del rectángulo libre del recinto. `objectType` e `illustrative` describen únicamente las piezas de referencia del layout, no sustituyen al registro comercial de producto.

## 9. Qué se conserva y qué se descarta

| Procedencia | Conservado | Sustituido o descartado |
|---|---|---|
| Prototipo 2 · La Casa ArteAnc | Patio central, casa modular, sillería trapezoidal, adobe, zócalos, vigas, escala humana, franjas por sala, marfil + Cormorant Garamond + Inter, cartela/ficha/favoritos/tutorial | Distribución asimétrica original, Textiles al norte, Metal al este, recepción desplazada, hojas de madera y dimensiones que contradigan este congelado |
| Prototipo 1 · concepto A | Tratamiento monumental concentrado en Santuario, piedra clara, portal profundo, bronce, basalto, ranura y acentos ámbar | Edificio completo de 40 × 36 m, gran galería monumental generalizada, puertas de bronce, apertura con montañas, suelos brillantes del render |
| Prototipo 1 · datos e implementación | Contrato de producto, `null`, precio ficticio, cinco estados, formato de layout, examen restaurable, lectura sentado/de pie, pruebas de datos/red/comercio/rendimiento | Cierre de salas futuras mediante puertas, tipos de peana de otras dimensiones, módulos o cotas de la propuesta anterior |
| Direcciones B y C del Prototipo 1 | Ninguna dirección artística nueva | Museo blanco curvo, anillos tecnológicos, espectáculo de luz, efectos que compitan con las piezas |

La inspiración andina es estilizada. No se reproduce un sitio arqueológico real ni se usa iconografía sagrada como decoración. “Santuario precolombino” nombra el espacio de la experiencia; no convierte sus objetos ilustrativos en originales antiguos.

## 10. Verificación de láminas

Esta tabla distingue comprobación del archivo geométrico, observación visual e información que una perspectiva no permite medir. Una medida escrita en un prompt no es una medición del PNG. Se revisaron las exportaciones finales; los recortes y las oclusiones no se interpretan como ausencia de un soporte en el layout. Las ocho perspectivas 04a–04h se entregan en **1920 × 1080, 16:9 exacto**, mediante exportación sin recorte ni deformación de sus originales de proporción nativa redondeada. Sus cámaras a 1,60 m son referencias de encuadre, no una calibración fotogramétrica de los píxeles.

| Archivo | Comparación con la planta / layout | Diferencias o límites observados | Estado |
|---|---|---|---|
| `01-planta.svg` | Geometría y posiciones derivadas de `02-layout.json`; incluye 38 slots, 7 accesos, ejes, cotas y escala. Recorrido corregido para atravesar D02 por su eje; fuentes reales incorporadas | La ranura se representa en proyección; los huecos muestran ancho de base, no trapecio en alzado | Revisado |
| `01-planta.png` | Misma planta que el SVG, con tipografía final y coordenadas de apoyo | Exportación raster, no usar píxeles como sustituto de las cotas | Revisado |
| `03-axonometrica.png` | Axonometría técnica calculada desde el JSON: muros completos de 4 y 6,50 m, 7 huecos abiertos, 38 puestos, franja sur y canal longitudinal. Proyección ortográfica con elevación 66° y azimut 22° | Se retiran las cubiertas; muros y dinteles ocultan parcialmente algunas piezas. Colores y objetos son esquemáticos, sin simular iluminación horneada. Se descartó la axonometría generativa porque acortaba los muros | Revisado geométrica y visualmente |
| `04a-umbral.jpg` | Mostrador al oeste; recepción despejada; portales abiertos y eje continuo hacia patio y Santuario. Fondo rehecho con peanas axiales y muro norte ciego | El mostrador está fuertemente escorzado; su tamaño y orientación se construyen desde `fixtures`, no se miden en la perspectiva. La distancia oculta detalles del Santuario | Revisado visualmente |
| `04b-patio.jpg` | Cerámica a la izquierda/oeste y Textiles a la derecha/este; peana sobre eje, canal al norte y un portal monumental abierto. Se corrigieron peanas del fondo, vitrina ajena a Textiles y altura de peana del patio | La cartela de P01 se presenta integrada junto al objeto en vez de su soporte separado del JSON; mantener la posición de `label` al construir. Los puestos laterales quedan parcialmente ocluidos | Revisado visualmente; detalle de cartela subordinado al layout |
| `04c-santuario-portal.jpg` | Jambas profundas y trapezoidales en sombra; tres peanas axiales, ranura superior y muro norte ciego. Sin hojas ni acceso añadido | Se ven cuatro hornacinas; las dos más próximas quedan ocultas por las jambas. La profundidad exacta del paso se toma de D07, no del tamaño aparente en la imagen | Revisado visualmente |
| `04d-santuario-interior.jpg` | Seis nichos laterales de bronce, seis cartelas murales inclinadas, tres peanas axiales de basalto, piedra clara, ranura y muro norte ciego. Corregidos encalado lateral y placas verticales de versiones descartadas | La modulación de juntas y el texto pequeño de las cartelas son ilustrativos; no copiar letras rasterizadas al producto. Profundidad de nicho y cotas de altura no se verifican midiendo el PNG | Revisado visualmente |
| `04e-ceramica.jpg` | Ocho puestos: seis peanas y dos vitrinas; tres al fondo, tres intermedios y dos cercanos. Cartelas separadas corregidas, franja terracota, muro oeste ciego y acceso detrás de cámara | Algunas cartelas se solapan visualmente con la pieza siguiente. La perspectiva abre la composición para mostrar los puestos; las separaciones exactas pertenecen al JSON | Revisado visualmente |
| `04f-textiles.jpg` | Seis muestras sobre peanas portapanel y dos mesas axiales, orientadas con su lado corto hacia la cámara. Se corrigieron orientación de mesas y altura de muestras; acento cochinilla, sin vitrinas | Las mesas se ilustran como volúmenes pétreos macizos; el diagrama técnico simplifica sus soportes. Cartelas apoyadas en cantos, no en todas las posiciones separadas del JSON. Para construir, mantener huellas y `label` del layout | Revisado visualmente; simplificación de soportes documentada |
| `04g-metal-piedra-instrumentos.jpg` | Seis puestos en dos columnas: cuatro peanas y dos vitrinas diagonales, eje libre, franja índigo con borde dorado; paredes ciegas y acceso norte detrás de cámara | El montaje del instrumento pequeño dentro de la vitrina es ilustrativo y requiere un soporte definitivo al modelar. No se atribuyen fechas ni procedencias | Revisado visualmente |
| `04h-taller.jpg` | Mesa central, cuatro peanas, hornacina encalada al sur, foco articulado, regla y lupa. Seis objetos ilustrativos; luz blanca de examen y suelo mate | El foco aparece al lado derecho de la composición; su posición de construcción es la de `fixtures`. La cartela bajo el nicho se muestra casi vertical: aplicar la inclinación y coordenadas del JSON | Revisado visualmente; detalles de montaje subordinados al layout |
| `05a-cartela.png` | Cartela de 0,50 × 0,35 m junto a peana de 0,50 × 0,50 × 1 m; apoyo y lectura acotados; tipo y datos desconocidos explícitos | Lámina de componente con esquema lateral, no perspectiva calibrada de C05. Posición mundial y orientación se leen del JSON | Revisado |
| `05b-ficha.png` | Chip Artesanía contemporánea, DEMO-001 no vendible, USD 120 marcado ficticio y cinco estados, incluido sin conexión. Materiales y dimensiones desconocidos | Esquema editorial de estados; botones, tamaños aparentes y legibilidad se deben comprobar en visor, no están implementados por el PNG | Revisado |
| `05c-ficha-santuario.png` | Chip Réplica prominente, aviso ilustrativo separado, Historia y fuentes, sin atribución, fecha ni procedencia inventadas; basalto y bronce coherentes | Variante de ejemplo, no certificación de una réplica real. Geometría de la viñeta simplificada; cotas declaradas mandan | Revisado |
| `05d-favoritos.png` | Panel sobre mostrador de piedra/madera, tres ejemplos no vendibles y mini-planta que ubica el mostrador al oeste de recepción; cotas y centro coinciden con `fixtures` | Esquema espacial y mini-planta, no captura fotográfica del vestíbulo ni carrito sincronizado. La sección accesible se resuelve en el modelo | Revisado |
| `05e-tutorial.png` | Teletransporte, giro de 30°, agarre y devolución de copia; modo sentado y alturas 1,60/1,20 m; misma tipografía y paleta | Diagramas de mandos genéricos y controles propuestos; requieren validación práctica en Quest 3 | Revisado |
| `06-kit.png` | Once módulos y paleta; cotas escritas de huecos, peanas, vitrinas, nichos y ranura coinciden con la especificación. Tipografía final Cormorant Garamond + Inter | Los módulos se muestran a escalas gráficas diferentes. La ranura es un detalle parcial de cubierta; sus extremos y posición completos están en el JSON | Revisado |

## 11. Pruebas de aceptación y pendientes de construcción

El paquete de diseño no demuestra funcionamiento en A-Frame/WebXR ni rendimiento en Quest 3. Los siguientes criterios, heredados del Prototipo 1 y ajustados a esta planta, son la puerta de entrada a construcción y validación.

| Prueba | Criterio de aceptación | Situación de este paquete |
|---|---|---|
| Geometría | Medidas libres, muros y huecos coinciden con JSON; no se duplican paredes compartidas | Planta y contrato definidos; comprobar modelo de construcción |
| Recorrido | Todas las salas alcanzables; galería sur con 2 m libres; muebles y canal fuera de destinos de teletransporte | Disposición fijada; navegación real pendiente |
| Escala | Piezas a escala conocida o marcadas como normalizadas; apoyos y cámaras correctos | Posiciones fijadas; modelos de catálogo pendientes |
| Sentado/de pie | Leer y activar acciones con ojos de referencia de 1,20/1,60 m sin alcance forzado | Pendiente en visor real |
| Paneles | Un panel principal; foco/cierre/restauración correctos, sin texto recortado | Láminas de referencia; interacción pendiente |
| Examen | Tomar copia, girar, ampliar con límites, volver a escala y orientación exactas | Pendiente de implementación |
| Datos | Precio nulo, stock cero/nulo, cambio de stock, texto largo y modelo ausente se distinguen correctamente | Contrato y estados definidos; pruebas de aplicación pendientes |
| Red | Carga, error y sin conexión distintos; navegación y selección conservadas | Pendiente de implementación |
| Comercio | Cancelación, ventana bloqueada, regreso a VR y clics repetidos no pierden ni duplican la selección | Pendiente; URL/API reales sin verificar |
| Contenido | Ninguna afirmación cultural sin fuente aprobada; tipos de pieza correctos | Demos marcadas; inventario editorial pendiente |
| Escritorio | Ratón, teclado, foco visible, Escape y alternativa HTML accesible | Pendiente |
| Rendimiento | Medir escena vacía, salas llenas, ficha abierta, examen y transición; registrar navegador y sistema | No medido en este encargo |
| Duración | 15 minutos de recorrido sin crecimiento sostenido de memoria, colisiones fallidas ni pérdida de selección | Pendiente en Quest 3 |

Presupuestos internos de partida del Prototipo 1: objetivo **72 Hz / 13,9 ms por fotograma**, hasta **150 llamadas de dibujo** y **250 000 triángulos visibles** por vista, objetivo de **256 MB de texturas residentes** y **20 MB de descarga inicial**. Son alertas para orientar las pruebas, no especificaciones oficiales del visor ni resultados obtenidos. La escena, la interfaz y la pieza de examen se miden juntas; descarga, memoria gráfica y memoria de la aplicación se registran por separado.

Riesgos que deben resolverse durante la construcción:

- **Carga y visibilidad.** El patio puede mostrar varias salas simultáneamente. Agrupar geometría y materiales por sala, precargar vecinas y liberar recursos lejanos; no fusionar toda la casa en un único activo indivisible.
- **Vidrio, agua y luces.** Limitar capas transparentes; sin refracción, reflejos de pantalla ni sombras dinámicas arquitectónicas. Probar una representación simplificada de vitrinas y del foco de examen si el coste es alto.
- **Luz horneada.** Revisar UV, uniones y fugas de luz, en especial portal profundo y hornacinas. La entrega no contiene lightmaps ni demuestra que ya se haya horneado una escena.
- **Lectura.** Verificar tildes/ñ y tamaños aparentes de Inter/Cormorant en el visor. La imagen del panel no sustituye al texto legible y ampliable de la aplicación.
- **Colisiones.** Construir superficies transitables con los bordes reales de cartelas y muebles. No teletransportar al canal, a peanas o a los retranqueos del portal.
- **Inventario.** Sustituir las 38 ilustraciones por piezas aprobadas, modelos con permisos y medidas documentadas. Mantener datos desconocidos como `null`.
- **Revisión posterior.** Claude revisará cada lámina contra planta y JSON antes del traslado aprobado a `docs/diseno/final/`. Este paquete no cambia `datos/salas.json`, no publica la escena y no da por terminada la Fase 4.

## 12. Fuentes del congelado

Se revisaron los archivos locales suministrados: Prototipo 1 (`README.md`, `Manual_diseno.md`, `Guia_implementacion.md`, `layout.json`, `producto_ejemplo.json` y `imagenes/concepto_A.png`); Prototipo 2 (`README.md`, `02-planta.svg`, `06-kit-arquitectonico.png` y sus catorce láminas). Las decisiones nuevas se limitan a resolver los conflictos geométricos y de representación documentados arriba. Los presupuestos y criterios de implementación proceden de esos manuales y no de una prueba nueva del dispositivo.

Entregar la carpeta `final/` completa dentro del ZIP, conservando fuentes y anexos. La planta y el JSON se produjeron primero y sirven de referencia al resto de láminas.

## 13. Producción y comprobaciones de esta entrega

La planta, la axonometría técnica, el kit y las cinco interfaces son gráficos vectoriales con Cormorant Garamond e Inter reales. Se conservan el SVG de planta y las fuentes editables en `fuentes-graficas/` y `fuentes-ui/`. Las ocho perspectivas se produjeron con el generador de imágenes integrado y se revisaron iterativamente; no se utilizó la ruta de API/CLI. Los prompts se registran en `prompts-generacion.json` y `prompts-axono-umbral.json`; las pruebas de axonometría generativa de este último archivo fueron descartadas y no forman parte de las láminas finales.

`QA_GEOMETRIA.json` registra las separaciones calculadas, `QA_AXONOMETRIA.json` la proyección y geometría del diagrama, y `QA_ENTREGA.json` la integridad de archivos, dimensiones de salas y accesos, IDs únicos, rutas conectadas y proporciones de imagen. El visor local se comprobó en escritorio y móvil, con apertura, siguiente y cierre por Escape, sin errores de JavaScript ni desbordamiento. Estas comprobaciones no sustituyen las pruebas de implementación enumeradas en la sección 11.
