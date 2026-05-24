# Arquitectura

IkasLab está organizada por capas.

## App Shell

`src/app` contiene arranque, rutas, layout, selección de usuario y home de módulos.

## Domain

`src/domain` contiene reglas puras:

- usuarios;
- avatares;
- contratos de módulos;
- puntuación;
- progreso;
- sesiones.

Estas funciones son testeables sin React ni Tauri.

## Modules

`src/modules` contiene módulos educativos aislados. Cada módulo define un manifest y su propia lógica.

El primer módulo completo es `english-vocabulary`.

## Services/Persistence

`src/services` expone servicios TypeScript usados por la UI. En Tauri llaman a comandos Rust; en navegador usan un fallback local para desarrollo.

`src-tauri/src` contiene SQLite, migraciones y comandos seguros.

## Shared UI

`src/shared/ui` contiene componentes reutilizables: botones, tarjetas, avatares, estados vacíos y feedback.

## Tauri Layer

La capa nativa gestiona:

- base de datos local;
- migraciones;
- comandos seguros;
- bundle NSIS;
- preparación de updater.
