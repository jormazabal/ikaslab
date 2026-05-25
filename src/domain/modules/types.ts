import type { ComponentType, SVGProps } from "react";

export type ModuleStatus = "active" | "coming-soon" | "disabled";

export interface ModuleProgress {
  userId: string;
  moduleId: string;
  points: number;
  bestScore: number;
  sessionsCount: number;
  lastPlayedAt: string | null;
  data: Record<string, unknown>;
}

export interface ModuleDashboardSummary {
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning";
}

export interface EducationalModuleManifest {
  id: string;
  title: string;
  shortDescription: string;
  longDescription?: string;
  category: string;
  route: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  status: ModuleStatus;
  version: string;
  storageNamespace: string;
  component: ComponentType;
  settingsComponent?: ComponentType;
  getInitialProgress?: (userId: string) => ModuleProgress;
  getDashboardSummary?: (progress?: ModuleProgress) => ModuleDashboardSummary[];
}
