# 🧪 Estrategia de Pruebas (TEST.md)

Este documento define la base procedimental para la validación autónoma de los criterios Visuales (AI Vision CQA) del Oráculo Semántico.

Las subtareas marcadas como obligatorias en el cierre de ciclo de TODO.md dictaminan la ejecución del workflow `/test` activando las siguientes rutinas de verificación:

1. **Trigger de UI Rendering (Glassmorphism & FOUC):** La evaluación inicial valida con `Playwright`/IA visual los requerimientos de destello inicial y transparencia `[Vision.01]`, `[Vision.02]`, `[Vision.03]` y `[Vision.10]`.
2. **Trigger de Responsive (Mobile Bounds):** Ejecutar snapshots bajo Viewport `375x812px` validando consistentes ocultamientos de rebose `[Vision.07]`.
3. **Trigger de Glitch (Interferencia >95%):** Forzar colisión algorítmica intencionada para testear macro y micro interpolaciones de glitches CSS `[Vision.04]` y `[Vision.05]`.
4. **Trigger de Legibilidad de Emojis Térmicos:** Verificación algorítmica de contraste y captura nativa sobre los rangos térmicos asegurando legibilidad extrema `[Vision.08]` y fallback tipográfico Unicode consistente `[Vision.09]`.
