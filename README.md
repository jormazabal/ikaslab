# IkasLab

IkasLab es una aplicación educativa de escritorio para Windows 11 construida con Tauri v2, React, TypeScript, Vite, Rust, SQLite y Tailwind CSS.

Incluye perfiles para adolescentes, avatares manga, puntos, histórico de partidas, catálogo modular y el módulo completo **Vocabulario de inglés**.

## Instalación en Windows 11

1. Abre la página de releases: [github.com/jormazabal/ikaslab/releases/latest](https://github.com/jormazabal/ikaslab/releases/latest).
2. Descarga el instalador `IkasLab_0.2.0_x64-setup.exe`.
3. Ejecuta el instalador.
4. Abre IkasLab desde el menú Inicio.

El instalador usa NSIS en modo `currentUser`, por lo que no necesita permisos de administrador. La app se instala en el perfil del usuario, bajo `%LOCALAPPDATA%`.

Si Windows SmartScreen muestra un aviso, es porque el instalador todavía no tiene firma de código Windows. La actualización de Tauri sí se firma con la clave del updater.

## Actualizaciones

IkasLab comprueba nuevas versiones publicadas en GitHub Releases. Cuando hay una versión disponible, la app muestra un aviso para descargar e instalar la actualización.

Las actualizaciones no eliminan:

- usuarios;
- avatar seleccionado;
- configuración local;
- vocabulario personalizado;
- progreso;
- puntuaciones;
- histórico de partidas.

Estos datos viven en la base de datos SQLite local del usuario, separada de los archivos instalados de la aplicación.

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

## Publicación de una release

Cada release debe actualizar el README y preparar la actualización automática de las aplicaciones instaladas.

Checklist:

1. Actualizar versiones en `package.json`, `package-lock.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` y `src-tauri/Cargo.lock`.
2. Actualizar la sección de instalación del README con el nuevo instalador.
3. Ejecutar `npm test`.
4. Ejecutar `npm run build`.
5. Crear commit.
6. Crear tag `vX.Y.Z`.
7. Subir `main` y el tag a GitHub.
8. Confirmar que la release contiene el instalador, la firma `.sig` y `latest.json`.

Ejemplo:

```bash
git tag v0.2.0
git push origin main
git push origin v0.2.0
```

El workflow [.github/workflows/release.yml](.github/workflows/release.yml) crea la release con el instalador Windows y `latest.json` para que el updater pueda detectarla.

## Updater

La configuración del updater está en `src-tauri/tauri.conf.json`.

Puntos clave:

- `bundle.createUpdaterArtifacts: true`
- `bundle.windows.nsis.installMode: "currentUser"`
- `plugins.updater.windows.installMode: "passive"`
- endpoint `https://github.com/jormazabal/ikaslab/releases/latest/download/latest.json`

Secrets necesarios en GitHub:

- `TAURI_SIGNING_PRIVATE_KEY`
- `TAURI_SIGNING_PRIVATE_KEY_PASSWORD`

Para rotar claves:

```bash
npm run tauri signer generate
```

Después hay que actualizar la clave pública en `plugins.updater.pubkey` y los secrets privados en GitHub.

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

## UI compartida

Los patrones visuales reutilizables están en `src/shared/ui`.

- `GlassPanel`: paneles tipo cristal.
- `Tag`: etiquetas compactas.
- `ChoiceButton`: opciones seleccionables.
- `Button`: acciones principales y secundarias.

La guía [AGENTS.md](AGENTS.md) indica que los futuros cambios deben reutilizar estos componentes antes de añadir estilos locales.

## Decisiones técnicas

- SQLite es la persistencia principal.
- React no accede a SQL directamente.
- Los componentes usan servicios/repositorios.
- No hay telemetría.
- El contenido educativo puede importarse/exportarse mediante JSON.
- Los módulos educativos son código compilado, no plugins dinámicos externos.
- La interfaz está en español y queda preparada para i18n futuro mediante separación de textos por dominio.

Más detalle en `docs/`.
