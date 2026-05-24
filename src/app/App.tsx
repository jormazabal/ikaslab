import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { AppDataProvider, useAppData } from "./providers/AppDataProvider";
import { AppShell } from "./shell/AppShell";
import { LoadingView } from "../shared/ui/LoadingView";
import { ProfileSelectionPage } from "./routes/ProfileSelectionPage";
import { HomePage } from "./routes/HomePage";
import { ModuleRoutePage } from "./routes/ModuleRoutePage";

function AppRoutes() {
  const { currentUser, loading } = useAppData();

  if (loading) {
    return <LoadingView />;
  }

  if (!currentUser) {
    return <ProfileSelectionPage />;
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/modules/:moduleId/*" element={<ModuleRoutePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}

export function App() {
  return (
    <HashRouter>
      <AppDataProvider>
        <AppRoutes />
      </AppDataProvider>
    </HashRouter>
  );
}
