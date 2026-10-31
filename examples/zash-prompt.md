# Ejemplo real: el encargo del vídeo de Zash

Este es el prompt con el que se montó el vídeo de Zash para la final del UR StartupCamp '26, en la Universidad de La Rioja. Zash es una app de salud con una pulsera que fotografía lo que comes y aprende tu normal para avisarte antes de que te pongas malo.

El material del proyecto no está en este repo. Lo que interesa es la estructura del encargo: contexto, qué leer y en qué orden, todo lo que debe verse, storyboard antes de montar y reglas concretas de marca, texto y render.

El vídeo final acabó llevando voz en off de ElevenLabs en lugar de narración en directo.

---

Vamos a montar con Remotion el vídeo de Zash para la final del hackathon UR StartupCamp '26 (Universidad de La Rioja). Remotion ya está instalado en esta carpeta de dev. Te he dejado en `zash-remotion/` todo el material del proyecto.

**Contexto.** Zash es una app de salud con una pulsera, Zash Aro, que tiene una pantalla táctil y una cámara. Haces un clic y la pulsera fotografía tu comida. Sus sensores aprenden «tu normal» y te avisan con un semáforo (verde, amarillo o rojo) antes de que te pongas malo. El vídeo dura unos 55 segundos y se proyecta en mitad del pitch: arranca justo cuando el ponente dice «clic» con la pulsera en la muñeca. No lleva voz grabada, porque la narramos en directo encima; solo lleva música suave. Por eso el texto en pantalla debe ser mínimo y grande, y los tiempos tienen que dejarnos hablar.

**Primero lee**, en este orden:

1. `zash-remotion/LEEME.md`
2. `01-guion/guion-video.md`: tramos, qué se ve y qué decimos. Es el punto de partida, pero aún no está cerrado.
3. `02-marca/marca.md`: logo, colores y fuentes.
4. `03-app/LEEME.md`
5. `04-pulsera/LEEME.md`: qué pasa en cada vídeo de la pulsera y en qué segundo.

Mira también las imágenes de `03-app/pantallas/` y `04-pulsera/imagenes/`, y la presentación de `05-presentacion/`, para coger el estilo.

**Lo que quiero que se vea: TODO.**

- La pulsera, aprovechando los vídeos y renders de `04-pulsera/`: el clic con el flash, la pantalla, la luz Tu Normal cambiando de color, el despiece, los sensores y el giro 360°.
- Todas las funciones de la app:
  - la foto que vuela al móvil y la IA que la etiqueta (macarrones con tomate, 620 kcal, 14:12);
  - el diario del día y de la semana, y el aviso de los hidratos;
  - «Tu Normal», con la banda verde, el pulso +8 y la temperatura +0,4 °C;
  - el aviso amarillo en el móvil y en la pulsera a la vez;
  - el informe para el médico, que solo se comparte si tú quieres;
  - el viernes de vuelta a verde;
  - los retos con amigos, con su racha y los premios del comercio local;
  - las recetas, las rutinas de deporte, la respiración guiada y el resumen semanal «lo que comes ↔ cómo duermes»;
  - que también funciona sin pulsera.
- El cierre: negro, el logo (el símbolo se dibuja: primero el latido y luego el plato) y «La salud sale del hospital». Se queda quieto unos 5 segundos para que digamos la frase final.

**ANTES DE MONTAR NADA, hazme un artifact con las tomas** para ver cómo queda.

Quiero una página que tenga, para cada toma:

- número y segundos de inicio y fin;
- un fotograma clave que de verdad se parezca al resultado final: un `npx remotion still` de un primer boceto, o una composición con las imágenes reales de la carpeta;
- qué se ve y cómo se mueve;
- la frase que decimos encima;
- los archivos de la carpeta que usa;
- la transición a la siguiente toma.

Arriba, pon una barra de tiempo con los 55 segundos. Si en esta sesión no puedes publicar artifacts, crea `storyboard.html` y ábrelo. Para ahí y espera a que te dé el visto bueno o te pida cambios.

**Cuando lo apruebe, móntalo así:**

- **Composición:** 1920 × 1080, 30 fps, unos 55 s, con el id `ZashVideo`. Usa una `<Sequence>` por toma y pon las duraciones en un único objeto de configuración, para que pueda reajustar los tiempos a la voz.
- **Recursos:** usa la carpeta desde `public/` (cópiala o enlázala) y cárgalos con `staticFile()`.
- **Pulsera:** usa los `.webm` transparentes con `<OffthreadVideo transparent>` encima del fondo de marca. Si necesitas un movimiento que no esté en los vídeos, usa el GLB con `@remotion/three`.
- **App:** rehaz las pantallas como componentes de React a partir de `03-app/pantallas-fuente.html`, con los mismos colores, fuentes y medidas, para poder animarlas:
  - barras que se llenan, la gráfica que se dibuja y cifras que cuentan;
  - notificaciones que entran deslizándose y toques en pantalla;
  - el móvil entrando con un muelle suave.

  Diseña las pantallas que faltan (están listadas en `03-app/LEEME.md`) con el mismo estilo.

- **El plato:** si hay una foto en `zash-remotion/fotos/macarrones.jpg`, úsala. Si no, ilústralo en el mismo estilo que la app. Nada de fotos de stock con marcas.
- **Marca:**
  - fuentes: Lexend para titulares y cifras, y Hanken Grotesk para el texto;
  - fondo `#071B19`, coral `#FF6B4A` como acento y verde azulado `#0B5D57`;
  - semáforo: verde `#2BD46A`, ámbar `#FFB020` y rojo `#FF4D4D`.

  Usa solo el logo de `02-marca/logos`.

- **Textos:** en español, con tildes, con pocas palabras y bien grandes (titulares de 64 px o más). Las cifras tienen que coincidir exactamente con las de `guion-video.md`.
- **Música:** deja preparada una pista opcional `public/zash/musica.mp3` con fundido de entrada y salida. No añadas música con derechos.

Para revisar: saca un `remotion still` de un fotograma por toma y míralos antes del render final. Cuando esté bien, renderiza `out/zash-video.mp4` (H.264, 1080p) y dime cómo cambiar los tiempos de cada toma.
