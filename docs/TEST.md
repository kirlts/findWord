# 🧪 Estrategia de Pruebas (TEST.md)

Este documento define la base procedimental para la validación autónoma de los criterios Visuales (AI Vision CQA) del Oráculo Semántico.

Las subtareas marcadas como obligatorias en el cierre de ciclo de TODO.md dictaminan la ejecución del workflow `/test` activando las siguientes rutinas de verificación:

1. **Trigger de UI Rendering (Glassmorphism & FOUC):** La evaluación inicial valida con `Playwright`/IA visual los requerimientos de destello inicial y transparencia `[Vision.01]`, `[Vision.02]`, `[Vision.03]` y `[Vision.10]`.
2. **Trigger de Responsive (Mobile Bounds):** Ejecutar snapshots bajo Viewport `375x812px` validando consistentes ocultamientos de rebose `[Vision.07]`.
3. **Trigger de Glitch (Interferencia >95%):** Forzar colisión algorítmica intencionada para testear macro y micro interpolaciones de glitches CSS `[Vision.04]` y `[Vision.05]`.
4. **Trigger de Legibilidad de Emojis Térmicos:** Verificación algorítmica de contraste y captura nativa sobre los rangos térmicos asegurando legibilidad extrema `[Vision.08]` y fallback tipográfico Unicode consistente `[Vision.09]`.

## Triggers QoL (UX, Intuitividad y Quality of Life)

Las siguientes rutinas verifican los checks derivados de la EPIC-005:

5. **Trigger de Onboarding y Textos (TASK-011):** Abrir el juego en ventana de incógnito sin localStorage → Validar presencia de componente de onboarding explicativo `[Jugador Novato.01]`, mensajes de carga comprensibles `[Jugador Novato.02]`, leyendas en cápsulas térmicas `[Jugador Novato.03]`, contexto de acción en brújula `[Jugador Novato.04]`, y diferenciación visual temperatura vs brújula `[Jugador Novato.05]`.
6. **Trigger de Descripción de Dificultad y Victoria (TASK-011):** Abrir el selector de dificultad → Cada opción muestra texto explicativo `[Jugador Novato.07]`. Ganar el juego → Panel de victoria auto-explicativo sin jerga `[Jugador Novato.08]`. Verificar contador de intentos visible `[Jugador Recurrente.02]`.
7. **Trigger de Mecánicas Interactivas (TASK-012):** Buscar affordance de pista/hint `[Jugador Novato.06]`, botón o modo de práctica libre `[Jugador Recurrente.03]`, y vista de estadísticas/historial `[Jugador Recurrente.04]`.
8. **Trigger de Conformidad Técnica (TASK-013):** Verificar stemming en Fácil `[Jugador Novato.10]`, pool de anclas ≥100 `[Jugador Novato.11]`, distorsión cromática en glitch `[Jugador Novato.09]`, y Zero Input Frames `[Jugador Novato.12]`.
9. **Trigger de Resiliencia y Persistencia (TASK-014):** Input inválido muestra feedback visible `[Jugador Novato.14]`, fallo del motor muestra error `[Jugador Novato.15]`, texto compartido tiene #NNN `[Jugador Recurrente.05]`, progresión cronológica correcta `[Jugador Recurrente.09]`, dificultad persiste entre días `[Jugador Recurrente.10]`, y fallo de descarga del motor muestra mensaje `[Jugador Recurrente.12]`.

