# Sistema Modular

Cada módulo se registra en `src/modules/registry.ts` con un manifest.

Campos obligatorios:

- `id`
- `title`
- `shortDescription`
- `longDescription`
- `category`
- `route`
- `icon`
- `status`
- `version`
- `storageNamespace`
- `component`

Campos opcionales:

- `settingsComponent`
- `getInitialProgress`
- `getDashboardSummary`

## Añadir un módulo

1. Crear una carpeta en `src/modules`.
2. Añadir `manifest.ts`.
3. Añadir componente principal.
4. Definir lógica propia en `domain`.
5. Registrar el manifest en `moduleRegistry`.
6. Añadir tests.

Los módulos no deben escribir directamente en SQLite desde React. Deben usar servicios comunes.

## Contenido configurable

El código de módulos se compila con la app. El contenido educativo puede importarse/exportarse por JSON versionado.
