# Release y Actualización

## Instalador

La app usa NSIS para Windows 11. Se configura en `src-tauri/tauri.conf.json`.

El instalador usa `installMode: "currentUser"`. Esto instala IkasLab en el perfil del usuario, bajo `%LOCALAPPDATA%`, y no requiere permisos de administrador.

Build local:

```bash
npm run tauri:build
```

Salida esperada:

```txt
src-tauri/target/release/bundle/nsis/
```

## GitHub Releases

El workflow `.github/workflows/release.yml` se ejecuta con tags `v*.*.*` o manualmente.

Usa `tauri-apps/tauri-action@v0`, que puede crear releases, subir artefactos y generar `latest.json` para el updater.

Checklist obligatorio antes de publicar:

1. Actualizar versiones en `package.json`, `package-lock.json`, `src-tauri/tauri.conf.json`, `src-tauri/Cargo.toml` y `src-tauri/Cargo.lock`.
2. Actualizar la sección principal de instalación del `README.md` con el nuevo instalador.
3. Ejecutar `npm test`.
4. Ejecutar `npm run build`.
5. Crear commit y tag `vX.Y.Z`.
6. Subir `main` y el tag.
7. Verificar que la release contiene `.exe`, `.sig` y `latest.json`.

## Updater

El updater usa `tauri-plugin-updater`.

La app comprueba actualizaciones al arrancar. Si hay una versión nueva publicada en GitHub Releases, muestra un aviso con botón para descargar e instalar.

La configuración relevante es:

- `bundle.createUpdaterArtifacts: true`
- `bundle.windows.nsis.installMode: "currentUser"`
- `plugins.updater.windows.installMode: "passive"`
- endpoint `https://github.com/jormazabal/ikaslab/releases/latest/download/latest.json`

Las actualizaciones no borran datos de usuario porque la base de datos SQLite vive en el directorio local de datos de aplicación, separado de los archivos instalados.

Para rotar claves o mover el repositorio:

1. Generar clave pública/privada del updater.
2. Poner la clave pública en `plugins.updater.pubkey`.
3. Guardar la privada en `TAURI_SIGNING_PRIVATE_KEY`.
4. Guardar contraseña en `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` si aplica.
5. Cambiar endpoint a `https://github.com/OWNER/REPOSITORY/releases/latest/download/latest.json`.
6. Cambiar `bundle.createUpdaterArtifacts` a `true`.

## Firma de código Windows

No se incluye certificado. Para distribución pública estable conviene firmar el instalador con certificado OV/EV o Azure Key Vault para reducir avisos SmartScreen.
