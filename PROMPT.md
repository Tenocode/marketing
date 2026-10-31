# Plantilla de encargo para Claude Code

Copia el bloque de abajo, rellena lo que está entre corchetes y pégalo en Claude Code abierto en la carpeta de este repo. Funciona igual con otros asistentes de código.

Lo importante es el orden: primero lee el material, después te enseña un storyboard y solo monta el vídeo cuando le das el visto bueno. En [examples/zash-prompt.md](examples/zash-prompt.md) tienes un encargo real ya relleno.

---

```markdown
Vamos a montar un vídeo con la plantilla de este repo (Remotion + ElevenLabs).
Lee primero README.md y docs/metodo.md para entender cómo está organizada.

**Contexto.** [Qué es tu producto o proyecto en dos frases. Dónde se va a ver
el vídeo: LinkedIn, un pitch, una presentación. Cuánto dura: unos X segundos.]

**Material.** Lo he dejado en `material/`:

- `guion.md`: qué se ve y qué se dice en cada tramo, con las cifras exactas.
- `marca.md`: colores, fuentes y logo.
- [capturas o HTML de la app, fotos, vídeos de producto…]

**Lo que quiero que se vea:**

- [Escena o idea 1]
- [Escena o idea 2]
- [Cierre: logo y frase final]

**ANTES DE MONTAR NADA, hazme un storyboard** en una página HTML con cada toma:
segundos de inicio y fin, un fotograma de muestra hecho con `npm run stills`
o con las imágenes reales, qué se ve y cómo se mueve, la frase de la voz en off
y los archivos que usa. Para ahí y espera mi visto bueno.

**Cuando lo apruebe:**

- Una escena por archivo en `src/scenes/`, con sus ids y duraciones en
  `DURATIONS` de `src/config.ts`, registradas en `SCENES` de `src/Demo.tsx`.
- Colores y fuentes de mi marca en `src/brand.ts`. Recursos en `public/` con
  `staticFile()`.
- Las pantallas de la app como componentes de React, para animarlas: barras que
  se llenan, cifras que cuentan, notificaciones que entran deslizándose.
- Texto en pantalla en español, poco y grande: titulares de 64 px o más.
- El guion de la voz en `script.json`, una frase por escena y los números con
  letra. Genera la voz con `npm run voice`.
- Revisa con `npm run stills` y mira los fotogramas antes de renderizar.
- Renderiza con `npm run render` y dime cómo cambiar los tiempos de cada escena.
```
