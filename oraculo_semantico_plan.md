
# 🔮 Oráculo Semántico: Master Design Specification (Exhaustivo)

## 1. Visión del Producto (El "Qué")

**El Oráculo Semántico** es un juego hiper-rápido de navegador, alojado de forma estática. El jugador debe adivinar una "Palabra Secreta" mediante pistas semánticas. Rompe con los puzles tradicionales al guiarse por un "radar en tiempo real", utilizando variables térmicas y una criptografía visual pura (sin depender de números aburridos) para dar feedback inmersivo. El juego es 100% local, privado y offline-first.

---

## 2. Infraestructura y Despliegue (El "Dónde" y "Por qué")

Estrictamente desarrollado bajo paradigma _"Zero-Backend"_.

* **Alojamiento:** **GitHub Pages** (Hosting gratuito, despliegue estático continuo).
* **Modelo de NLP:** `Xenova/multilingual-e5-small` con cuantización en 8-bits (`dtype: 'q8'`).
* **Motor de Ejecución:** `Transformers.js` ejecutado mediante **WebAssembly (WASM)** en un Web Worker en segundo plano. Carga cero una vez guardado en el OPFS/IndexedDB.
* **Stack UI:** Vite + React + Tailwind CSS + _Motion_ (animaciones físicas) + `Aceternity UI/Magic UI`. Todo enrutado en modo Hash (`HashRouter`) para compatibilidad perfecta con GitHub Pages.

---

## 3. UI y Estética: "Oráculo de Cristal" (Glassmorphism)

La premisa de diseño evoca el "Apple Vision Pro" combinado con un oráculo futurista.

* **Modo Oscuro Puro:** Fondos `#0A0A0A` con luces reactivas (Auroras/Background Beams).
* **Detector de Metales (Feedback en vivo):** NO HAY BOTÓN DE "ADIVINAR". La evaluación WASM dura \~45ms. Mientras el usuario teclea (con un `debounce` de 100ms), la interfaz se ilumina y vibra sin recargas basándose en sus letras en curso.
* **Cuerpo Central (Glassmorphism):** El bloque de juego usa renderizado esmerilado translúcido `backdrop-filter: blur(24px)`.

---

## 4. Estructura de Feedback de 2 Emojis (Mecánica Núcleo)

La interfaz expulsa 2 cápsulas dinámicas de feedback:

### A. La Temperatura Semántica (Indicador de Magnitud)

Representa porcentualmente (1-100%) cuán cerca está la palabra del objetivo con 100 emojis prohibiendo "caritas" para conectar con los atavismos del jugador:

* 🌌 **0% - 9% (El Abismo):** `[🕳️, 🌌, 🌑, 🕋, ⚓, 🪨, ⛓️‍💥]`
* 🧊 **10% - 19% (Congelado Profundo):** `[🧊, ❄️, 🏔️, 💧, 🩵, 💦, 🫧]`
* 🌊 **20% - 29% (Aguas Profundas):** `[🌊, 🪼, 🐋, 🦈, 🐚, 🛶, 🌧️]`
* 🌱 **30% - 39% (Germinación):** `[🌱, 🪴, 🌿, 🍀, 🌾, 🍄‍🟫, 🌵, 🪵]`
* 🍃 **40% - 49% (Viento y Movimiento):** `[🍃, 🎐, 🪽, 🪭, 🪁, 🚁, 🧭, 💨]`
* ☀️ **50% - 59% (Iluminación):** `[☀️, 🌤️, 🌻, 🍋‍🟩, 🍯, 💡, 🕯️]`
* ⚡ **60% - 69% (Energía y Chispa):** `[⚡, 🌩️, 🔌, 🔋, 🪄, ✨, 🌟, 💥]`
* 🔥 **70% - 79% (Calambres y Calor):** `[🔥, ♨️, 🌶️, 🌋, 🧨, 🧯, 🚗, 🌡️]`
* 🩸 **80% - 89% (Alerta Roja):** `[🩸, 🌹, 🍷, 🍎, 🎸, 🧲, 🥊, 🚨]`
* 🚀 **90% - 99% (Fusión Crítica):** `[🚀, ☄️, 🐦‍🔥, 🐉, ☢️, 🎯, 🥇]`
* 💎 **100% (Victoria Singular):** El reflejo exacto. Diamante inmutable.

### B. "La Brújula Alquímica" (El Ingrediente Faltante)

* **Matemática Vectorial:** La IA ejecuta la resta normalizada `[Vector Meta] - [Vector Intento] = [Vector Direccional]`.
* **Clasificación:** Mide ese Vector Dirección contra \~150 _Vectores Ancla Universales_.
* **UI Resultante:** La cápsula dice exactamente qué sumar. _(Ej: `🧭 Te falta el ingrediente: [💡 Intelecto Humano]`)_.

---

## 5. Diseño de Resolución de Edge Cases de IA

1. **Lupa de Ruido (>95% Similitud):** A distancias <5% la Brújula da ruido estadístico. Si `similitud > 95%`, la UI oculta la Brújula explícita y sufre un glitch CSS (`animation: glitch`), mostrando `[🫨 Interferencia Electromagnética]`. Obliga a buscar el sinónimo exacto sin dependencias de categorías macro.
2. **Paradoja de los Antónimos:** Se asegura que en memoria haya Polos Opuestos M.E.C.E. (Ej: Mucha Luz / Poca Luz) para calcular distorsiones opuestas.
3. **Polisemia (Banco plaza/dinero):** El juego asume la polisemia como mecánica y reta al jugador explícitamente en el tutorial a usar palabras inequívocas.

---

## 6. Dificultades Parametrizables

El rigor del `Coseno` requerido para ganar:

* **Fácil (90%):** Acepta toda la familia semántica de la raíz.
* **Medio (95% - Recomendado):** Perdona género, plurares erróneos, etc.
* **Difícil (99%):** Exige raíz pura, idéntica.

---

## 7. Retención (Bucle Viral de Compartir)

* **Juego Único Global:** Usa la fecha como `seed` universal para que el mundo juegue el mismo reto.
* **Encriptación de Logro:** Cuando el jugador pulsa "Compartir", copia un mensaje abstracto basado en la curva térmica de sus emojis para intriga (libre de spoilers textuales):
    `🌟 Oráculo Semántico #041`
    `Encontré el centro en 12 Pings.`
    `🕳️ 🧊 💧 🌿 🍃 ☀️ ⚡ 🧨 🔥 ☢️ 💎`
   `--- Sigue la brújula.`

---

## 8. El Diccionario Objetivo (Base de las 100 Palabras V1.0)

Para evitar que el juego seleccione palabras inabarcables, oscuras o polisémicamente complejas, el modo diario extraerá palabras exclusivamente de este diccionario cerrado. Consta de 100 palabras genéricas agrupadas en 10 dominios de la existencia humana. Son términos en español neutro, reconocibles universalmente independientemente de la región o cultura.

**1. Naturaleza y Clima**
`Agua`, `Fuego`, `Viento`, `Montaña`, `Tormenta`, `Océano`, `Desierto`, `Nieve`, `Nube`, `Volcán`

**2. Fauna y Biología**
`Perro`, `Águila`, `Tiburón`, `Hormiga`, `Serpiente`, `Dinosaurio`, `Elefante`, `Araña`, `Oso`, `Caballo`

**3. Objetos Cotidianos y Herramientas**
`Espejo`, `Reloj`, `Cuchillo`, `Llave`, `Zapato`, `Silla`, `Tijera`, `Cama`, `Vaso`, `Maleta`

**4. Emociones y Sentimientos**
`Miedo`, `Amor`, `Rabia`, `Tristeza`, `Alegría`, `Sorpresa`, `Esperanza`, `Culpa`, `Paz`, `Odio`

**5. Tecnología y Ciencia**
`Computadora`, `Electricidad`, `Telescopio`, `Cohete`, `Rueda`, `Internet`, `Batería`, `Motor`, `Robot`, `Microscopio`

**6. Conceptos Abstractos y Tiempo**
`Historia`, `Verdad`, `Sueño`, `Futuro`, `Silencio`, `Infinito`, `Memoria`, `Mentira`, `Pasado`, `Destino`

**7. Alimentos y Sabores**
`Pan`, `Sal`, `Manzana`, `Azúcar`, `Café`, `Queso`, `Huevo`, `Leche`, `Miel`, `Arroz`

**8. Espacios y Geografía**
`Ciudad`, `Bosque`, `Isla`, `Puente`, `Laberinto`, `Cueva`, `Castillo`, `Calle`, `Mercado`, `Frontera`

**9. Profesiones y Roles Humanos**
`Rey`, `Médico`, `Soldado`, `Maestro`, `Ladrón`, `Cazador`, `Juez`, `Héroe`, `Esclavo`, `Sacerdote`

**10. Astronomía y Mitología**
`Luna`, `Estrella`, `Fantasma`, `Dragón`, `Galaxia`, `Sol`, `Ángel`, `Vampiro`, `Cometa`, `Sirena`

# Verification Checklist — Oráculo Semántico

## System Identity

El sistema proporciona a los jugadores retroalimentación visual inmediata y localizada sobre la proximidad semántica de sus intentos para guiarlos hacia el descubrimiento de un concepto objetivo diario.

## Actors

* **Jugador** (Consumer)
* **Motor Semántico** (Dependency)
* **AI Vision CQA** (Operator)

## Author-Provided Checks

* **[Author.01] Desempeño del Motor WASM.**
  Ejecutar el proceso de inferencia de intento → El procesamiento de NLP debe concluir en ~45ms.
* **[Author.02] Reactividad sin botones.**
  Teclear el intento pausando por 100ms (debounce) → La interfaz se ilumina y vibra procesando el texto sin necesidad de un botón "Adivinar".
* **[Author.03] Condición especial de Interferencia (>95%).**
  Evaluar una palabra con >95% de similitud sin ser correcta → La interfaz oculta la brújula direccional y aplica animación `glitch` con texto `[🫨 Interferencia Electromagnética]`.
* **[Author.04] Privacidad criptográfica al compartir.**
  Pulsar el botón 'Compartir' tras un logro → Se copia un progreso puramente abstracto compuesto por emojis térmicos y número de intentos sin spoilers textuales.
* **[Author.05] Aislamiento del cliente.**
  Inspeccionar la red del juego activo → El juego funciona 100% de manera local, privada y offline (tras la carga inicial).

## Derived Verification Checklist

### Jugador

* **[Jugador.01] Confirmación de carga instantánea de recursos primarios UI.**
  Navegar a originURL en una ventana de incógnito → Interfaz estilo "glassmorphism" oscuro es arrojada y renderizada con éxito.
* **[Jugador.02] Representación termal ante intentos muy distanciados.**
  Insertar palabra extremadamente distante (15% similitud) → Se imprime cápsula visual con un emoji representativo del tier "Hielo/Agua", ocultando el valor numérico bruto porcentual.
* **[Jugador.03] Ajuste de requerimientos estrictos según dificultad.**
  Alternar de dificultad Media a Difícil y adivinar un sustantivo plural del destino meta → Se rechaza la respuesta exigiendo al jugador la raíz pura unívoca de la palabra, impidiendo otorgar el 100%.
* **[Jugador.04] Restricción de palabras objetivo al conjunto normalizado original.**
  Visualizar el puzzle generado a lo largo del mismo día (GMT) → La palabra diaria es consistentemente extraída y pre-fijada únicamente de la colección canónica de 100 conceptos.
* **[Jugador.05] Notificación de clarificación ante input de términos polisémicos manifiestos.**
  Teclear un concepto hiper-polisémico documentado en el diccionario nativo (ej. "Banco") → La plataforma dibuja un aviso retando al Jugador a usar otra palabra de mayor especificidad contextual.
* **[Jugador.06] Preservación intacta del estado termodinámico recargando página.**
  Refrescar manualmente una pestaña mientras existe historial a la mitad del progreso → Las filas continuas de cápsulas termales continúan vivas recurriendo al indexado local previo persistente.
* **[Jugador.07] Inmunidad continua frente a cortes de conexión tras setup inicial.**
  Desconectar Wi-Fi durante el juego e ingresar una letra → Output visual se sigue renderizando procesando pings exitosamente y arrojando color termal.
* **[Jugador.08] Interacción responsiva plena sobre dispositivos móviles.**
  Teclear e ingresar interacciones táctiles en viewport simulado celular → Flujos de vibración e iluminación reaccionan positivamente bajo `touchstart` o equivalentes de manera idéntica al PC.
* **[Jugador.09] Exigencia semántica concesiva en dificultad Fácil.**
  Ajustar variable Dificultad a Fácil y teclear palabra estrictamente afín morfológica/semánticamente → El sistema consiente victoria dando 100% perdonando imperfecciones de sintaxis o género.

### Motor Semántico

* **[Motor Semántico.01] Instanciación offline exitosa del NLP optimizado a 8 bits.**
  Leer variables de memoria en el navegador bajo carga base inicial → Los módulos Transformers.js acusan uso de modelos `Xenova` cuantizados y persistentes vía OPFS/IndexedDB.
* **[Motor Semántico.02] Arquitectura de cálculos sin bloqueo de renders de frame de UI.**
  Iniciar una petición asíncrona hacia el motor procesando el intento → La respuesta es gestionada en background thread sin congelar la animación en la ventana DOM.
* **[Motor Semántico.03] Manejo y resolución polar de antónimos conceptuales.**
  Suministrar conceptos lógicamente contrarios o diametralmente excluyentes → El Motor arroja el resultado porcentualmente más negativo/nulo (tiers del "Abismo").
* **[Motor Semántico.04] Mecanismo subyacente de intersección para "El Ingrediente Faltante".**
  Forzar vector de resta (Destino menos Intento) y verificar su evaluación → Consola reporta cruce interpolado entre esa resta y las 150 anclas universales, resultando en el string exactivo indicativo (brújula).
* **[Motor Semántico.05] Aceptación asintótica sobre gemelos semánticos o palabras exactas iteradas.**
  Suministrar como prompt la misma palabra destino → Coeficiente resultante aritmético en consola acierta exacto en 1.0 (Activación de match o Victoria).
* **[Motor Semántico.06] Rechazo inofensivo ante cadenas compuestas indebidamente por emojis.**
  Suministrar símbolos exóticos UTF-8 o cadenas vacías recurrentes como input activo → El Worker principal atrapa la instancia errónea ignorándola sin estrellar ni cerrar WebAssembly principal.
* **[Motor Semántico.07] Sanitización eficiente y resiliencia ante ataques de Longitud extrema.**
  Suministrar serie de inputs repetitivos abismales superando contexto local admitido → El pipeline NLP lo fragmenta/recorta evitando fugas masivas y prosigue inferencias tranquilamente.
* **[Motor Semántico.08] Ciclo de vida estricto del Hilo al sufrir estrés del VirtualDOM.**
  Bombardear reactividad UI en React o Vanilla forzando decenas de micro-rendered doms de cápsulas térmicas en 1 segundo → Un único hilo global Background local retiene inferencia manteniéndose invulnerable a fugas de memoria o recreaciones.
* **[Motor Semántico.09] Degradación limpia ante carencia o throttling de hardware cliente.**
  Limitar capacidad de CPU y memoria desde DevTools → El motor dilata latencia por encima del umbral esperado pero jamás retorna fatalidades 'Out of Memory' preservando accesibilidad a dispositivos gamma baja.

### Verificación Visual Automatizada (Playwright + AI Vision)

_(Checks diseñados exclusivamente para evaluar aspectos estéticos, físicos y renderizados sin manipulación de estado, alimentando snapshots desde Chromium directamente al LLM)._

* **[Vision.01] Descarte de Destellos Blancos iniciales (FOUC).**
  Tomar snapshot durante los primeros 100ms tras inicializar el host → El fondo de la pantalla debe verse uniformemente `#0A0A0A` sin cajas blancas previas a la hidratación del framework.
* **[Vision.02] Validación del efecto de cristal opaco (Glassmorphism).**
  Tomar snapshot sobre el contenedor central donde se revelan los emojis → Se debe apreciar consistentemente un bloque central translúcido difuminando imperceptiblemente la oscuridad del fondo (`backdrop-filter`).
* **[Vision.03] Inexistencia de tipografías primarias por defecto.**
  Tomar snapshot de cualquier cuerpo de texto (instrucciones o estado) → Absolutamente ninguna tipografía debe adoptar estética Serif obsoleta genérica (ej. Times New Roman), demostrando carga eficaz de web-fonts.
* **[Vision.04] Evidencia de distorsión CSS por "Interferencia".**
  Mandar comando para adivinar palabra afín (>95%) y tomar una ráfaga de snapshots → La palabra visible debe padecer alteraciones cromáticas, de sangría, o desgarros geométricos coherentes a una estética "glitch".
* **[Vision.05] Evaporación estética incondicional de la Brújula.**
  Inspeccionar imagen renderizada durante modo `Interferencia` → Se constata visualmente que carece y censura cualquier ícono, vector direccional y leyenda referida explícitamente a posiciones vectoriales.
* **[Vision.06] Feedback reactivo (Micro-animaciones).**
  Generar un evento 'hover' mediante el cursor localizador de Playwright hacia un botón y tomar pantalla → La imagen capturada debe exhibir transformaciones perceptibles (iluminación o resize orgánico) respecto al botón en reposo.
* **[Vision.07] Disciplina del Viewport Móvil (Zero Overflow).**
  Cortar el tamaño del viewport a `375px x 812px` y tomar fotografía a componente padre → Ninguno de los elementos o textos genera un recorte invisible obligando la aparición de barras de desplazamiento horizontales.
* **[Vision.08] Legibilidad y Contraste de paletas temáticas térmicas.**
  Analizar paleta visual general sobre un historial de adivinanza poblado → Los background-colors elegidos para cada temperatura nunca oscurecen letalmente la visibilidad del propio emoji ante el fondo puro oscuro de la UI.
* **[Vision.09] Renderización pura y cohesiva de caracteres Unicode (Emojis).**
  Capturar historial completo post-victoria estático → Cada unidad conceptual termal debe expresarse gráficamente sin manifestar los icónicos "bloques negros" o "[?]" que delatan fallos de font-fallback en el OS destino.
* **[Vision.10] Entorno inmersivo e invisible (Zero Input Frames).**
  Tomar screenshot full-screen durante etapa de inyección de letras (antes del debounce) → El área base carece por completo de rebordes predeterminados o glow azul clásico del `<input>` de Google Chrome, pareciendo magia espontánea.

## Coverage Matrix

| Actor | AVAIL | FUNC | CORR | INTEG | RESIL |
|---|---|---|---|---|---|
| Jugador | [Jugador.01] | [A.02], [A.03], [A.04], [Jugador.02], [Jugador.03], [Jugador.08] | [Jugador.04], [Jugador.05], [Jugador.09] | [Jugador.06] | [A.05], [Jugador.07] |
| Motor Semántico | [Motor Semántico.01] | [A.01], [Motor Semántico.02], [Motor Semántico.09] | [Motor Semántico.03], [Motor Semántico.04], [Motor Semántico.05] | [Motor Semántico.08] | [Motor Semántico.06], [Motor Semántico.07] |
| AI Vision CQA | N/A | [Vision.01], [Vision.02], [Vision.04], [Vision.05], [Vision.06] | [Vision.03], [Vision.08] | [Vision.10] | [Vision.07], [Vision.09] |
