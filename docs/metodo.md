# El método

Así se hizo el vídeo de Zash para el UR StartupCamp '26, y así está pensada esta plantilla. Funciona igual si escribes tú el código o si se lo encargas a un asistente como Claude Code.

## 1. Reúne el material antes de nada

Una carpeta con todo lo que el vídeo va a necesitar. Cuanto mejor esté, menos se inventa y mejor sale.

- **Guion:** qué se ve y qué se dice en cada tramo, con las cifras exactas.
- **Marca:** colores en hexadecimal, fuentes en archivo y logo en SVG.
- **Recursos:** capturas o el HTML de tu app, fotos, renders 3D. Si tienes vídeos de producto, mejor en WebM con fondo transparente, para ponerlos encima de tu propio fondo.
- **Referencias de estilo:** la presentación del pitch o un vídeo que te guste.

En Zash eran cinco carpetas: guion, marca, app, pulsera y presentación, cada una con un LEEME que explicaba qué había dentro.

## 2. Storyboard antes de montar

Antes de animar, una página con cada toma: segundos, un fotograma de muestra, qué se ve, qué se dice, qué archivos usa y cómo pasa a la siguiente. Ahí es donde se discute y se cambia, porque cambiar un storyboard es barato y cambiar un vídeo montado no.

Con Claude Code basta con pedírselo en el encargo y decirle que espere tu visto bueno. [PROMPT.md](../PROMPT.md) ya lo incluye.

## 3. Una escena, un componente

Cada toma es un componente de React en `src/scenes/`. Las duraciones viven en un único objeto, `DURATIONS` en `src/config.ts`, para poder reajustar el ritmo sin tocar las escenas.

Las pantallas de la app no son capturas: se rehacen como componentes con los mismos colores y medidas. Así se pueden animar barras que se llenan, cifras que cuentan o notificaciones que entran deslizándose.

## 4. La voz manda

Primero la voz, después el ritmo. `npm run voice` genera toda la narración de una vez con ElevenLabs y recibe el tiempo de cada palabra. Con eso calcula cuánto dura cada escena y qué trozo de audio suena en ella.

Cada escena se diseña para una duración fija, y `src/pace.ts` acelera o frena sus animaciones en proporción. Así una escena que se queda en 3,5 segundos no corta nada a medias.

## 5. Revisa por fotogramas y renderiza

`npm run stills` saca un fotograma de cada escena. Es mucho más rápido que renderizar el vídeo entero para comprobar un detalle. Cuando todo está bien, `npm run render`.

## Consejos para que quede bien

- **Poco texto y grande.** Titulares de 64 px o más en 1080p. Si hay voz, el texto en pantalla solo subraya.
- **Escribe para el oído.** Números con letra en el guion de voz y una frase por escena, que termine donde cambia la imagen.
- **Subtítulos para redes.** LinkedIn e Instagram reproducen sin sonido. Los tiempos por palabra de `audio/voice-alignment.json` sirven para generarlos.
- **Formato vertical.** Para TikTok o Reels cambia `WIDTH` y `HEIGHT` a 1080 × 1920 en `src/config.ts` y recoloca las escenas.
- **Música discreta.** Instrumental, sin melodía que compita con la voz. La plantilla la baja sola mientras se habla.
