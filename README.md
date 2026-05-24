# IkasLab

IkasLab es una aplicación educativa de escritorio para Windows 11 construida con Tauri v2, React, TypeScript, Vite, Rust, SQLite y Tailwind CSS.

La primera versión incluye perfiles infantiles, avatares, puntos, histórico de partidas, catálogo modular y el módulo completo **Vocabulario de inglés**.

## Desarrollo

```bash
npm install
npm run dev
npm run tauri:dev
```

`npm run dev` abre la versión web con persistencia local de desarrollo. `npm run tauri:dev` abre la aplicación Tauri real con SQLite.

## Tests

```bash
npm test
```

Los tests cubren puntuación, validación de respuesta, pistas, selección de bloques, usuarios, sesiones y contrato de módulos.

## Build

```bash
npm run build
npm run tauri:build
```

El instalador Windows está configurado con NSIS. El artefacto se genera dentro de `src-tauri/target/release/bundle/nsis`.

## Publicación

El workflow `.github/workflows/release.yml` crea una release al publicar una etiqueta `vX.Y.Z`.

```bash
git tag v0.1.0
git push origin v0.1.0
```

La release se publica con el instalador y `latest.json` para que el updater pueda detectarla.

El instalador NSIS está configurado como `currentUser`, por lo que no requiere permisos de administrador en Windows 11 y se instala bajo `%LOCALAPPDATA%`.

## Updater

La configuración del updater está en `src-tauri/tauri.conf.json`. La app comprueba si hay una versión nueva y muestra un aviso dentro de IkasLab para descargar e instalar la actualización.

Las actualizaciones reemplazan los binarios de la app, pero no eliminan la base de datos local con usuarios, avatares, configuración, progreso y puntuaciones.

Para configurar otro repositorio o rotar claves:

1. Genera claves con `npm run tauri signer generate`.
2. Sustituye `REPLACE_WITH_TAURI_UPDATER_PUBLIC_KEY` por la clave pública.
3. Cambia el endpoint `OWNER/REPOSITORY` por el repositorio real.
4. Añade estos secrets en GitHub:
   - `TAURI_SIGNING_PRIVATE_KEY`
   - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

La firma de código Windows es opcional al inicio, pero recomendable para reducir avisos SmartScreen.

## Módulos

Los módulos se registran en tiempo de compilación en `src/modules/registry.ts`. Para añadir uno nuevo:

1. Crea `src/modules/nombre-modulo`.
2. Define `manifest.ts`.
3. Implementa el componente principal.
4. Registra el manifest en `moduleRegistry`.
5. Añade tests de contrato y lógica.

Los módulos futuros ya registrados como “Próximamente” son Matemáticas rápidas, Geografía y Lectura.

## Vocabulario

El vocabulario inicial está en `src/modules/english-vocabulary/data/initialVocabulary.ts`. Desde la app se puede:

- ver bloques;
- añadir, editar y eliminar bloques;
- ver términos;
- añadir, editar y eliminar términos;
- importar JSON versionado;
- exportar JSON;
- restaurar el vocabulario inicial.

El formato se valida con Zod y usa `schemaVersion: 1`.

## Decisiones Técnicas

- SQLite es la persistencia principal.
- React no accede a SQL directamente.
- Los componentes usan servicios/repositorios.
- No hay telemetría.
- El contenido educativo puede importarse/exportarse mediante JSON.
- Los módulos educativos son código compilado, no plugins dinámicos externos.
- La interfaz está en español y queda preparada para i18n futuro mediante separación de textos por dominio.

Más detalle en `docs/`.
