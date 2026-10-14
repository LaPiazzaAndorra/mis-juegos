# Registro de decisiones (ADR simplificado)

**Regla:** cada decisión importante añade sección fechada. No cambiar silenciosamente una decisión aprobada: agregar una nueva que explique el motivo y su sustitución.

## D-001 · Manual versionado en GitHub · 14/10/2026

- **Decisión:** documentación del proyecto y de cada cambio junto al código, con estado actualizado y changelog.
- **Motivo:** un asistente puede perder el contexto; Git conserva el historial de documentos y revisiones.
- **Límite:** Git no guarda automáticamente los datos del navegador de Amaia; exportarlos exige función aparte.

## D-002 · Ramas protegidas · 14/10/2026

- **Decisión:** desarrollar en rama; no modificar/fusionar `main` sin aprobación explícita.
- **Motivo:** evitar que una prueba sustituya el juego estable.

## D-003 · Estética infantil aprobada · registros previos

- **Decisión:** conservar menús pastel, botones grandes y un aspecto de ilustración propio.
- **Motivo:** el diseño actual gusta; no rediseñarlo arbitrariamente para introducir funciones.

## D-004 · Avatar premium por capas · registros previos

- **Decisión:** ropa, ojos, piel, pelo y accesorios intercambiables; avatar guardable y usable en «Mi Mundo».
- **Motivo:** la ilustración debe ser funcional e interactiva; no pegar una fotografía plana.
- **Estado:** integración progresiva; distinguir base/ojos aprobados de cabello/ropa pendientes.

## D-005 · Datos de usuario preservados · registros previos

- **Decisión:** mantener estrellas, dibujos, escenas, niveles y láminas al actualizar la app.
- **Motivo:** proteger el progreso infantil y las creaciones existentes.
- **Consecuencia:** pruebas de migración y planes de respaldo obligatorios.
