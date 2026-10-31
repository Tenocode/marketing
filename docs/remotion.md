# Remotion en 10 minutos

[Remotion](https://www.remotion.dev) dibuja un vídeo como una página web, fotograma a fotograma. Para cada fotograma ejecuta tus componentes de React con el número de fotograma actual y hace una captura. Si sabes hacer una web con React, sabes hacer un vídeo.

## La composición

Un vídeo es una `<Composition>` con tamaño, fotogramas por segundo y duración. Está en `src/Root.tsx`:

```tsx
<Composition
  id="Demo"
  component={Demo}
  durationInFrames={TOTAL_FRAMES}
  fps={30}
  width={1920}
  height={1080}
/>
```

El `id` es el nombre que usan los comandos, como `remotion render Demo`.

## Animar es interpolar

`useCurrentFrame()` te dice en qué fotograma estás. Todo lo demás se calcula a partir de él. La plantilla trae `between` en `src/anim.ts`, una versión cómoda de `interpolate`:

```tsx
const frame = useCurrentFrame();
// Opacidad de 0 a 1 entre los fotogramas 0 y 12
const opacity = between(frame, 0, 12);
```

Nada de `setTimeout` ni de transiciones CSS. Si el valor depende del fotograma, el vídeo es siempre idéntico al renderizarlo.

## Muelles

`spring` da movimientos naturales, con un pequeño rebote. `springIn` empieza en el fotograma que le digas:

```tsx
const enter = springIn(frame, fps, 6);
<div style={{ transform: `translateY(${(1 - enter) * 900}px)` }} />;
```

Así entra el móvil de la escena `Phone`.

## Escenas en secuencia

`<Sequence from={...}>` coloca algo en el tiempo. Dentro, `useCurrentFrame()` empieza en cero. `src/Demo.tsx` pone cada escena en su `Sequence` y añade un fundido entre ellas.

Las duraciones están en `DURATIONS` de `src/config.ts`, en segundos. Para añadir una escena:

1. Crea el componente en `src/scenes/`.
2. Añade su id y su duración a `DURATIONS`.
3. Regístrala en `SCENES` dentro de `src/Demo.tsx`.
4. Añade la escena a `scenes` de `script.json`, en el mismo orden. Si no lleva voz, déjale el `text` vacío: `npm run voice` le dará la duración de su `min`.

## Ritmo

Cada escena se anima para una duración de diseño, como `PHONE_DESIGN = 150` fotogramas. Si la voz deja la escena en 105 fotogramas, `usePacedFrame()` de `src/pace.ts` hace que todas sus animaciones vayan 1,43 veces más rápido. Así no tienes que recalcular nada cuando cambia la voz.

## Recursos

Todo lo que esté en `public/` se carga con `staticFile()`:

```tsx
<Img src={staticFile("logo.png")} />
<Audio src={staticFile("music.mp3")} volume={0.3} />
```

Para vídeos de producto con fondo transparente, usa WebM y `OffthreadVideo`:

```tsx
<OffthreadVideo src={staticFile("producto.webm")} transparent />
```

Las fuentes se cargan desde archivo con `loadFont` de `@remotion/fonts`, en `src/brand.ts`. Así el render no depende de internet.

## Revisar y renderizar

```bash
npm run dev       # Studio: línea de tiempo, fotograma a fotograma, cambios en vivo
npm run stills    # Un fotograma por escena, para revisar rápido
npm run render    # El vídeo final
```

La primera vez que renderizas, Remotion descarga una versión de Chrome sin interfaz. Tarda un poco, pero solo pasa una vez.

## Para seguir

- [Documentación oficial](https://www.remotion.dev/docs)
- [Recursos y plantillas](https://www.remotion.dev/resources)
