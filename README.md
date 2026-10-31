# marketing · vídeos con código

Plantilla para hacer vídeos animados sin programa de edición. **Remotion** convierte código React en vídeo y **ElevenLabs** pone la voz en off y la música. La voz llega con el tiempo de cada palabra, así que cada escena dura justo lo que dura su frase.

![Demo de la plantilla](docs/demo.gif)

Este GIF es la demo que trae el repo: cinco escenas y 18 segundos. Para verla con voz y música, ejecuta `npm run render`.

La plantilla nació del vídeo que hice para **Zash**, un proyecto de idea de negocio. En [examples/zash-prompt.md](examples/zash-prompt.md) tienes el prompt real con el que se montó.

## Qué necesitas

- [Node.js](https://nodejs.org) 20.12 o superior.
- Una cuenta de [ElevenLabs](https://elevenlabs.io), solo si quieres generar voz o música. La demo funciona sin ella.
- Opcional: [Claude Code](https://claude.com/claude-code) u otro asistente de código, para describir el vídeo en lugar de programarlo a mano.

## Empezar

En GitHub, pulsa **Use this template** para crear tu propia copia del repo. Después clónala y arranca:

```bash
git clone <la-url-de-tu-copia>
cd marketing
npm install
npm run dev
```

`npm run dev` abre Remotion Studio en el navegador. Ahí ves el vídeo, avanzas fotograma a fotograma y los cambios en el código se ven al instante. Si usas pnpm, `pnpm install` y `pnpm dev` funcionan igual.

## Hacer tu propio vídeo

1. **Escribe el guion** en [script.json](script.json): una frase por escena, el `voice_id` de la voz que elijas y el prompt de la música.
2. **Pon tu clave.** Copia `.env.example` como `.env` y pega tu clave de ElevenLabs. `.env` nunca se sube a GitHub.
3. **Genera la voz** con `npm run voice`. Las escenas se ajustan solas a lo que dura cada frase.
4. **Diseña las escenas** en [src/scenes/](src/scenes/). Cada escena es un componente de React. Los colores y las fuentes están en [src/brand.ts](src/brand.ts).
5. **Revisa** con `npm run stills`, que saca un fotograma de cada escena en `out/stills/`.
6. **Renderiza** con `npm run render`. El vídeo sale en `out/demo.mp4`.

Si usas Claude Code, empieza por [PROMPT.md](PROMPT.md). Es una plantilla de encargo para que te proponga un storyboard antes de montar nada.

### Sin ElevenLabs

La plantilla funciona sin voz. Pon `active: false` en `VOICE` de [src/config.ts](src/config.ts) y escribe a mano la duración de cada escena en `DURATIONS`. La música es independiente: se apaga con `active: false` en `MUSIC`, o se cambia por cualquier mp3 que tengas en `public/`.

## Comandos

| Comando                   | Qué hace                                                                      |
| ------------------------- | ----------------------------------------------------------------------------- |
| `npm run dev`             | Abre Remotion Studio para ver y editar el vídeo                               |
| `npm run voice`           | Genera la voz si el texto o la voz han cambiado y cuadra las escenas con ella |
| `npm run voice -- --sync` | Solo cuadra las escenas con la voz que ya tienes, sin gastar créditos         |
| `npm run voice -- --new`  | Pide otra toma aunque el texto no haya cambiado                               |
| `npm run music`           | Normaliza la música. Con `-- --new` genera una pista nueva                    |
| `npm run stills`          | Un fotograma por escena en `out/stills/`                                      |
| `npm run render`          | El vídeo final en `out/demo.mp4`, H.264 a 1080p                               |
| `npm run gif`             | La vista previa de `docs/demo.gif`                                            |
| `npm run lint`            | Comprueba los tipos de TypeScript                                             |

## Cómo está organizado

```
script.json          Guion: voz, texto de cada escena y prompt de la música
src/
  config.ts          Duración de cada escena, volúmenes y texto final
  Demo.tsx           Junta las escenas, los fundidos, la voz y la música
  scenes/            Una escena por archivo
  components/        Piezas reutilizables: fondo, texto que entra, móvil
  anim.ts            Ayudas de animación: interpolar, muelles, contadores
  pace.ts            Acelera o frena cada escena para que encaje con la voz
  brand.ts           Colores y fuentes
scripts/             Voz, música y fotogramas, con ElevenLabs y el ffmpeg de Remotion
audio/               Audio original de ElevenLabs y tiempos de cada palabra
public/              Lo que usa el vídeo: fuentes, música y voz normalizadas
```

## Guías

- [docs/metodo.md](docs/metodo.md): el proceso completo, del material al render.
- [docs/remotion.md](docs/remotion.md): lo mínimo de Remotion para entender y cambiar la plantilla.
- [docs/elevenlabs.md](docs/elevenlabs.md): voces, música, créditos y uso comercial.

## Licencias

- **El código** de este repo es MIT: úsalo como quieras.
- **Remotion** tiene licencia propia. Es gratis para particulares, organizaciones sin ánimo de lucro y empresas de hasta 3 personas. Una empresa más grande necesita una [licencia de empresa](https://www.remotion.dev/license).
- **ElevenLabs** solo permite uso comercial del audio en planes de pago. Revisa sus [condiciones](https://elevenlabs.io/pricing) antes de publicar un anuncio.
- **Las fuentes** Lexend y Hanken Grotesk tienen licencia [SIL Open Font License](public/fonts/OFL.txt).
- **El audio de la demo** se generó con ElevenLabs para este repo. Úsalo como referencia y genera el tuyo para tus vídeos.
