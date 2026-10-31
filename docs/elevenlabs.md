# ElevenLabs: voz y música

[ElevenLabs](https://elevenlabs.io) genera voces muy naturales a partir de texto y también música instrumental. La plantilla usa su API directamente con `fetch`, sin instalar su SDK. El cliente está en `scripts/elevenlabs.mjs`.

## La clave

1. Crea una cuenta en elevenlabs.io.
2. Ve a **Developers > API Keys** y crea una clave.
3. Copia `.env.example` como `.env` y pégala:

```
ELEVENLABS_API_KEY=tu_clave
```

`.env` está en `.gitignore`, así que nunca se sube a GitHub. No pegues la clave en ningún otro archivo.

## Elegir la voz

En la **Voice Library** de ElevenLabs escuchas voces y las añades a tu cuenta. Cada una tiene un `voice_id`, que copias en `script.json`:

```json
"voice": {
  "name": "Dani",
  "voice_id": "7QQzpAyzlKTVrRzQJmTE",
  "model_id": "eleven_v3",
  "voice_settings": { "stability": 0.5 },
  "tag": "[excited]",
  "tempo": 1
}
```

- **model_id:** `eleven_v3` es el más expresivo y entiende etiquetas de emoción.
- **tag:** una etiqueta que va delante de todo el texto, como `[excited]` o `[calm]`. Déjala vacía si no la quieres.
- **stability:** más baja da una voz más viva, más alta la hace más constante.
- **tempo:** acelera o frena la voz ya generada sin cambiar el tono. Con `1.1` va un 10 % más rápida. En JSON el decimal va con punto.

Si la API rechaza el `voice_id`, comprueba que has añadido esa voz a tu cuenta y que tu plan permite usar voces de la biblioteca. Si no, elige una de las voces predeterminadas que trae tu cuenta.

## Escribir para la voz

- Una frase por escena, en el campo `text` de cada escena.
- Si la frase acaba en punto, la escena puede alargarse con silencio hasta su `min`, en segundos. Si no acaba, la narración sigue en la escena siguiente sin pausa.
- Una escena sin voz lleva el `text` vacío y dura su `min`. Todas las escenas de `src/config.ts` tienen que estar en `script.json`, en el mismo orden.
- Escribe los números con letra: «seiscientas veinte calorías», no «620 kcal».
- `delay` retrasa la voz dentro de su escena, por ejemplo para dejar entrar primero un título.

## Generar y cuadrar

```bash
npm run voice
```

1. Si el texto, la voz o sus ajustes han cambiado desde la última vez, pide la locución entera con el tiempo de cada palabra. Guarda el original en `audio/`.
2. La normaliza a −16 LUFS, el volumen habitual en redes, y la deja en `public/voice/narration.mp3`.
3. Reparte las palabras entre las escenas y reescribe `DURATIONS` en `src/config.ts` y los tramos de `src/voice-timing.ts`.

Si solo cambias el `tempo` o los mínimos, usa `npm run voice -- --sync`. No llama a ElevenLabs y no gasta créditos. Si te gusta el texto pero no cómo ha sonado, `npm run voice -- --new` pide otra lectura.

## Música

```bash
npm run music -- --new
```

Genera una pista instrumental a partir del `prompt` de `script.json`. Funciona mejor si describes el ambiente, los instrumentos y el tempo, y pides que no compita con una voz. El original va a `audio/music-original.mp3` y la versión normalizada a `public/music.mp3`.

Sin `--new` solo vuelve a normalizar la pista que ya tienes. En `MUSIC` de `src/config.ts` eliges cuánto baja mientras habla la voz y los fundidos de entrada y salida.

## Créditos

ElevenLabs cobra en créditos. Con `eleven_v3` cada carácter de texto gasta un crédito, así que la voz de la demo cuesta unos 250. La música gasta bastante más que la voz. Los scripts imprimen los créditos gastados al terminar.

## Uso comercial

El plan gratuito no permite uso comercial y exige citar a ElevenLabs. Para anuncios o vídeos de empresa necesitas un plan de pago. Las condiciones cambian, así que revisa su [página de precios](https://elevenlabs.io/pricing) antes de publicar.
