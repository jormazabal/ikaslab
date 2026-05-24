import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { getModuleById } from "../../modules/registry";
import { EmptyState } from "../../shared/ui/EmptyState";

export function ModuleRoutePage() {
  const { moduleId } = useParams();
  const manifest = moduleId ? getModuleById(moduleId) : undefined;

  if (!manifest) {
    return (
      <EmptyState
        title="Módulo no encontrado"
        description="La ruta no coincide con ningún módulo registrado en el catálogo."
      />
    );
  }

  const ModuleComponent = manifest.component;
  const SettingsComponent = manifest.settingsComponent;

  return (
    <Routes>
      <Route path="/" element={<ModuleComponent />} />
      {SettingsComponent && <Route path="/settings" element={<SettingsComponent />} />}
      <Route path="*" element={<Navigate to={manifest.route} replace />} />
    </Routes>
  );
}
