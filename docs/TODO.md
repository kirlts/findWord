# 🗺️ Oráculo Semántico: TODO & Roadmap

Este documento rige la ejecución estricta del proyecto. Contiene 100% de la especificidad dictada por la biblia (`MASTER-SPEC.md`). Toda tarea debe implementarse de forma estricta y culminar con la validación de sus respectivos *checks* literales y de la matriz de cobertura. El cierre de cada bloque requiere ejecutar obligatoriamente `/document` y `/test`.

## [EPIC-001] Infraestructura y Despliegue Zero-Backend, y Setup UI
(Refiere a Secciones 2 y 3)

### [TASK-001] Stack y Motor Base
- [x] Implementar Alojamiento: **GitHub Pages** (Hosting gratuito, despliegue estático continuo).
- [x] Configurar Modelo de NLP: `Xenova/multilingual-e5-small` con cuantización en 8-bits (`dtype: 'q8'`).
- [x] Implementar Motor de Ejecución: `Transformers.js` ejecutado mediante **WebAssembly (WASM)** en un Web Worker en segundo plano. Carga cero una vez guardado en el OPFS/IndexedDB.
- [x] Usar Stack UI: Vite + React + Tailwind CSS + _Motion_ (animaciones físicas) + `Aceternity UI/Magic UI`. Todo enrutado en modo Hash (`HashRouter`) para compatibilidad perfecta con GitHub Pages.
- [x] **[Motor Semántico.01] Instanciación offline exitosa del NLP optimizado a 8 bits.** Leer variables de memoria en el navegador bajo carga base inicial → Los módulos Transformers.js acusan uso de modelos `Xenova` cuantizados y persistentes vía OPFS/IndexedDB.
- [x] **[Motor Semántico.02] Arquitectura de cálculos sin bloqueo de renders de frame de UI.** Iniciar una petición asíncrona hacia el motor procesando el intento → La respuesta es gestionada en background thread sin congelar la animación en la ventana DOM.
- [x] **[Author.01] Desempeño del Motor WASM.** Ejecutar el proceso de inferencia de intento → El procesamiento de NLP debe concluir en ~45ms.
- [x] **[Author.05] Aislamiento del cliente.** Inspeccionar la red del juego activo → El juego funciona 100% de manera local, privada y offline (tras la carga inicial).
- [x] **[Jugador.07] Inmunidad continua frente a cortes de conexión tras setup inicial.** Desconectar Wi-Fi durante el juego e ingresar una letra → Output visual se sigue renderizando procesando pings exitosamente y arrojando color termal.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-002] Estética "Oráculo de Cristal" (Glassmorphism)
- [x] Implementar la premisa de diseño que evoca el "Apple Vision Pro" combinado con un oráculo futurista.
- [x] Aplicar **Modo Oscuro Puro:** Fondos `#0A0A0A` con luces reactivas (Auroras/Background Beams).
- [x] Construir **Cuerpo Central (Glassmorphism):** El bloque de juego usa renderizado esmerilado translúcido `backdrop-filter: blur(24px)`.
- [x] **[Jugador.01] Confirmación de carga instantánea de recursos primarios UI.** Navegar a originURL en una ventana de incógnito → Interfaz estilo "glassmorphism" oscuro es arrojada y renderizada con éxito.
- [x] **[Vision.01] Descarte de Destellos Blancos iniciales (FOUC).** Tomar snapshot durante los primeros 100ms tras inicializar el host → El fondo de la pantalla debe verse uniformemente `#0A0A0A` sin cajas blancas previas a la hidratación del framework.
- [x] **[Vision.02] Validación del efecto de cristal opaco (Glassmorphism).** Tomar snapshot sobre el contenedor central donde se revelan los emojis → Se debe apreciar consistentemente un bloque central translúcido difuminando imperceptiblemente la oscuridad del fondo (`backdrop-filter`).
- [x] **[Vision.03] Inexistencia de tipografías primarias por defecto.** Tomar snapshot de cualquier cuerpo de texto (instrucciones o estado) → Absolutamente ninguna tipografía debe adoptar estética Serif obsoleta genérica (ej. Times New Roman), demostrando carga eficaz de web-fonts.
- [x] **[Vision.07] Disciplina del Viewport Móvil (Zero Overflow).** Cortar el tamaño del viewport a `375px x 812px` y tomar fotografía a componente padre → Ninguno de los elementos o textos genera un recorte invisible obligando la aparición de barras de desplazamiento horizontales.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

## [EPIC-002] Mecánica Estructural y Feedback Vectorial
(Refiere a Secciones 3, 4 y 6)

### [TASK-003] Reactividad Teclado y UX
- [x] Configurar **Detector de Metales (Feedback en vivo):** NO HAY BOTÓN DE "ADIVINAR". La evaluación WASM dura ~45ms. Mientras el usuario teclea (con un `debounce` de 100ms), la interfaz se ilumina y vibra sin recargas basándose en sus letras en curso.
- [x] **[Author.02] Reactividad sin botones.** Teclear el intento pausando por 100ms (debounce) → La interfaz se ilumina y vibra procesando el texto sin necesidad de un botón "Adivinar".
- [x] **[Jugador.08] Interacción responsiva plena sobre dispositivos móviles.** Teclear e ingresar interacciones táctiles en viewport simulado celular → Flujos de vibración e iluminación reaccionan positivamente bajo `touchstart` o equivalentes de manera idéntica al PC.
- [x] **[Vision.06] Feedback reactivo (Micro-animaciones).** Generar un evento 'hover' mediante el cursor localizador de Playwright hacia un botón y tomar pantalla → La imagen capturada debe exhibir transformaciones perceptibles (iluminación o resize orgánico) respecto al botón en reposo.
- [x] **[Vision.10] Entorno inmersivo e invisible (Zero Input Frames).** Tomar screenshot full-screen durante etapa de inyección de letras (antes del debounce) → El área base carece por completo de rebordes predeterminados o glow azul clásico del `<input>` de Google Chrome, pareciendo magia espontánea.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-004] Temperatura Semántica y Representación Emoji
- [x] Programar que la interfaz expulse 2 cápsulas dinámicas de feedback, la primera siendo la **Temperatura Semántica** representando porcentualmente (1-100%).
- [x] Mapear los 100 emojis estrictos por tier (prohibiendo caritas):
  - 🌌 0% - 9%: `[🕳️, 🌌, 🌑, 🕋, ⚓, 🪨, ⛓️‍💥]`
  - 🧊 10% - 19%: `[🧊, ❄️, 🏔️, 💧, 🩵, 💦, 🫧]`
  - 🌊 20% - 29%: `[🌊, 🪼, 🐋, 🦈, 🐚, 🛶, 🌧️]`
  - 🌱 30% - 39%: `[🌱, 🪴, 🌿, 🍀, 🌾, 🍄‍🟫, 🌵, 🪵]`
  - 🍃 40% - 49%: `[🍃, 🎐, 🪽, 🪭, 🪁, 🚁, 🧭, 💨]`
  - ☀️ 50% - 59%: `[☀️, 🌤️, 🌻, 🍋‍🟩, 🍯, 💡, 🕯️]`
  - ⚡ 60% - 69%: `[⚡, 🌩️, 🔌, 🔋, 🪄, ✨, 🌟, 💥]`
  - 🔥 70% - 79%: `[🔥, ♨️, 🌶️, 🌋, 🧨, 🧯, 🚗, 🌡️]`
  - 🩸 80% - 89%: `[🩸, 🌹, 🍷, 🍎, 🎸, 🧲, 🥊, 🚨]`
  - 🚀 90% - 99%: `[🚀, ☄️, 🐦‍🔥, 🐉, ☢️, 🎯, 🥇]`
  - 💎 100%: `[💎] (Victoria Singular, reflejo exacto)`
- [x] **[Jugador.02] Representación termal ante intentos muy distanciados.** Insertar palabra extremadamente distante (15% similitud) → Se imprime cápsula visual con un emoji representativo del tier "Hielo/Agua", ocultando el valor numérico bruto porcentual.
- [x] **[Vision.08] Legibilidad y Contraste de paletas temáticas térmicas.** Analizar paleta visual general sobre un historial de adivinanza poblado → Los background-colors elegidos para cada temperatura nunca oscurecen letalmente la visibilidad del propio emoji ante el fondo puro oscuro de la UI.
- [x] **[Vision.09] Renderización pura y cohesiva de caracteres Unicode (Emojis).** Capturar historial completo post-victoria estático → Cada unidad conceptual termal debe expresarse gráficamente sin manifestar los icónicos "bloques negros" o "[?]" que delatan fallos de font-fallback en el OS destino.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-005] "La Brújula Alquímica" (El Ingrediente Faltante)
- [x] Implementar **Matemática Vectorial:** La IA ejecuta la resta normalizada `[Vector Meta] - [Vector Intento] = [Vector Direccional]`.
- [x] Implementar **Clasificación:** Mide ese Vector Dirección contra ~150 Vectores Ancla Universales.
- [x] Configurar **UI Resultante:** La cápsula (segunda dinámica) dice exactamente qué sumar. (Ej: `🧭 Te falta el ingrediente: [💡 Intelecto Humano]`).
- [x] **[Motor Semántico.04] Mecanismo subyacente de intersección para "El Ingrediente Faltante".** Forzar vector de resta (Destino menos Intento) y verificar su evaluación → Consola reporta cruce interpolado entre esa resta y las 150 anclas universales, resultando en el string exactivo indicativo (brújula).
- [x] **[Jugador.05] Notificación de clarificación ante input de términos polisémicos manifiestos.** Teclear un concepto hiper-polisémico documentado en el diccionario nativo (ej. "Banco") → La plataforma dibuja un aviso retando al Jugador a usar otra palabra de mayor especificidad contextual.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

## [EPIC-003] Edge Cases de IA, Dificultad y Diccionario
(Refiere a Secciones 5 y 8)

### [TASK-006] Diccionario Estricto y Evaluación Coseno
- [x] Implementar El Diccionario Objetivo (Base de las 100 Palabras V1.0), agrupando por dominios específicos y cerrados (Ej: Naturaleza, Fauna, Objetos, etc.).
- [x] Extraer palabras diarias **exclusivamente** de este diccionario V1.0 oficial de 100 palabras.
- [x] Establecer el **Juego Único Global:** Usa la fecha como `seed` universal para que el mundo juegue el mismo reto.
- [x] Implementar **Dificultades Parametrizables** controlando el rigor del Coseno: Fácil (90%), Medio (95% recomendado), Difícil (99%).
- [x] **[Jugador.04] Restricción de palabras objetivo al conjunto normalizado original.** Visualizar el puzzle generado a lo largo del mismo día (GMT) → La palabra diaria es consistentemente extraída y pre-fijada únicamente de la colección canónica de 100 conceptos.
- [x] **[Jugador.09] Exigencia semántica concesiva en dificultad Fácil.** Ajustar variable Dificultad a Fácil y teclear palabra estrictamente afín morfológica/semánticamente → El sistema consiente victoria dando 100% perdonando imperfecciones de sintaxis o género.
- [x] **[Jugador.03] Ajuste de requerimientos estrictos según dificultad.** Alternar de dificultad Media a Difícil y adivinar un sustantivo plural del destino meta → Se rechaza la respuesta exigiendo al jugador la raíz pura unívoca de la palabra, impidiendo otorgar el 100%.
- [x] **[Motor Semántico.05] Aceptación asintótica sobre gemelos semánticos o palabras exactas iteradas.** Suministrar como prompt la misma palabra destino → Coeficiente resultante aritmético en consola acierta exacto en 1.0 (Activación de match o Victoria).
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-007] Resolución de Ruido (>95%) e Interferencias
- [x] Implementar **Lupa de Ruido (>95% Similitud):** A distancias <5% la Brújula da ruido estadístico.
- [x] Si `similitud > 95%`, la UI oculta la Brújula explícita y sufre un glitch CSS (`animation: glitch`), mostrando `[🫨 Interferencia Electromagnética]`.
- [x] Implementar **Paradoja de los Antónimos:** Asegurar Polos Opuestos M.E.C.E para calcular distorsiones.
- [x] **[Motor Semántico.03] Manejo y resolución polar de antónimos conceptuales.** Suministrar conceptos lógicamente contrarios o diametralmente excluyentes → El Motor arroja el resultado porcentualmente más negativo/nulo (tiers del "Abismo").
- [x] **[Author.03] Condición especial de Interferencia (>95%).** Evaluar una palabra con >95% de similitud sin ser correcta → La interfaz oculta la brújula direccional y aplica animación `glitch` con texto `[🫨 Interferencia Electromagnética]`.
- [x] **[Vision.04] Evidencia de distorsión CSS por "Interferencia".** Mandar comando para adivinar palabra afín (>95%) y tomar una ráfaga de snapshots → La palabra visible debe padecer alteraciones cromáticas, de sangría, o desgarros geométricos coherentes a una estética "glitch".
- [x] **[Vision.05] Evaporación estética incondicional de la Brújula.** Inspeccionar imagen renderizada durante modo `Interferencia` → Se constata visualmente que carece y censura cualquier ícono, vector direccional y leyenda referida explícitamente a posiciones vectoriales.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-008] Sanitización de Entrada Extraordinaria
- [x] **[Motor Semántico.06] Rechazo inofensivo ante cadenas compuestas indebidamente por emojis.** Suministrar símbolos exóticos UTF-8 o cadenas vacías recurrentes como input activo → El Worker principal atrapa la instancia errónea ignorándola sin estrellar ni cerrar WebAssembly principal.
- [x] **[Motor Semántico.07] Sanitización eficiente y resiliencia ante ataques de Longitud extrema.** Suministrar serie de inputs repetitivos abismales superando contexto local admitido → El pipeline NLP lo fragmenta/recorta evitando fugas masivas y prosigue inferencias tranquilamente.
- [x] **[Motor Semántico.08] Ciclo de vida estricto del Hilo al sufrir estrés del VirtualDOM.** Bombardear reactividad UI en React o Vanilla forzando decenas de micro-rendered doms de cápsulas térmicas en 1 segundo → Un único hilo global Background local retiene inferencia manteniéndose invulnerable a fugas de memoria o recreaciones.
- [x] **[Motor Semántico.09] Degradación limpia ante carencia o throttling de hardware cliente.** Limitar capacidad de CPU y memoria desde DevTools → El motor dilata latencia por encima del umbral esperado pero jamás retorna fatalidades 'Out of Memory' preservando accesibilidad a dispositivos gamma baja.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

## [EPIC-004] Retención y Cierre Viral
(Refiere a Sección 7)

### [TASK-009] Persistencia (Session Memory)
- [x] **[Jugador.06] Preservación intacta del estado termodinámico recargando página.** Refrescar manualmente una pestaña mientras existe historial a la mitad del progreso → Las filas continuas de cápsulas termales continúan vivas recurriendo al indexado local previo persistente.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-010] Vector de Triunfo Criptográfico (Compartir)
- [x] Configurar **Encriptación de Logro:** Botón "Compartir", copia abstracción térmica de emojis libre de spoilers textuales. Ejemplo plantilla: `🌟 Oráculo Semántico #041 \n Encontré el centro en 12 Pings. \n 🕳️ 🧊 💧 🌿 🍃 ☀️ ⚡ 🧨 🔥 ☢️ 💎 \n --- Sigue la brújula.`
- [x] **[Author.04] Privacidad criptográfica al compartir.** Pulsar el botón 'Compartir' tras un logro → Se copia un progreso puramente abstracto compuesto por emojis térmicos y número de intentos sin spoilers textuales.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

## [EPIC-005] UX, Intuitividad y Quality of Life ("A Prueba de Tontos")
(Refiere a Checklist QoL en MASTER-SPEC)

### [TASK-011] Onboarding, Textos de Ayuda y Feedback Comprensible
- [x] (2024-05-24 10:00:00) **[Author.QoL.06]** Implementar textos de orientación para usuario nuevo.
- [x] (2024-05-24 10:00:00) **[Author.QoL.07]** Diferenciar visualmente cápsulas de diagnóstico (temperatura) vs guía (brújula).
- [x] (2024-05-24 10:00:00) **[Jugador Novato.01]** Onboarding auto-explicativo al primer contacto.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.02]** Carga del motor con feedback comprensible ("Preparando el oráculo...").
- [x] (2024-05-24 10:00:00) **[Jugador Novato.03]** Leyenda explicativa en la cápsula termal.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.04]** Contexto de acción en la brújula alquímica.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.05]** Diferenciación visual diagnóstico vs guía.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.07]** Descripción funcional de cada nivel de dificultad.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.08]** Panel de victoria auto-explicativo.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.01]** Acceso directo sin onboarding repetido.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.02]** Contador visible de intentos en sesión.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-012] Mecánicas de Interacción: Hints, Práctica Libre y Estadísticas
- [x] (2024-05-24 10:00:00) **[Author.QoL.08]** Implementar mecanismo de pista (hint).
- [x] (2024-05-24 10:00:00) **[Author.QoL.09]** Implementar modo de práctica libre.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.06]** Affordance visible para solicitar pista.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.03]** Modo de práctica libre disponible.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.04]** Historial y estadísticas de partidas.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-013] Correcciones Técnicas de Auditoría (Defectos de Conformidad)
- [x] (2024-05-24 10:00:00) **[Author.QoL.01]** Implementar stemming/lemmatización para dificultad Fácil.
- [x] (2024-05-24 10:00:00) **[Author.QoL.02]** Expandir vectores ancla de 15 a ≥100 para la brújula.
- [x] (2024-05-24 10:00:00) **[Author.QoL.03]** Añadir distorsiones cromáticas al glitch CSS (text-shadow RGB, clip-path, hue-rotate).
- [x] (2024-05-24 10:00:00) **[Author.QoL.04]** Eliminar bordes visibles del contenedor de input (Zero Input Frames).
- [x] (2024-05-24 10:00:00) **[Author.QoL.05]** Implementar HashRouter o validar compatibilidad de ruta estática.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.09]** Distorsión glitch cromática y geométrica.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.10]** Victoria por normalización morfológica en Fácil.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.11]** Resolución de anclas universales en la brújula.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.12]** Zero Input Frames en el campo de texto.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

### [TASK-014] Resiliencia, Persistencia y Compartir Robusto
- [x] (2024-05-24 10:00:00) **[Jugador Novato.13]** Persistencia de intentos entre recargas.
- [x] (2024-05-24 10:00:00) **[Jugador Novato.14]** Rechazo visible de input inválido (no silencio).
- [x] (2024-05-24 10:00:00) **[Jugador Novato.15]** Error handling visible ante fallo del motor.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.05]** Identificador secuencial del reto (#NNN) en texto compartido.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.06]** Fallback de Clipboard API.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.07]** Aviso de transición de día.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.08]** Consistencia UTC de la palabra diaria.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.09]** Progresión cronológica correcta en texto compartido.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.10]** Persistencia de dificultad entre días.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.11]** Enrutamiento en modo Hash.
- [x] (2024-05-24 10:00:00) **[Jugador Recurrente.12]** Mensaje comprensible ante fallo de descarga del motor.
- [x] 🔄 Ejecutar workflow `/document` y `/test` para sincronización.

