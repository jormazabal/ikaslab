import { BookOpen, Calculator, Map } from "lucide-react";
import type { EducationalModuleManifest } from "../domain/modules/types";
import { PlaceholderModule } from "./placeholder/PlaceholderModule";
import { englishVocabularyManifest } from "./english-vocabulary/manifest";

export const moduleRegistry: EducationalModuleManifest[] = [
  englishVocabularyManifest,
  {
    id: "quick-math",
    title: "Matemáticas rápidas",
    shortDescription: "Resuelve pequeños retos de cálculo mental.",
    longDescription: "Un futuro módulo para practicar sumas, restas, multiplicaciones y cálculo.",
    category: "Matemáticas",
    route: "/modules/quick-math",
    icon: Calculator,
    status: "coming-soon",
    version: "0.1.0",
    storageNamespace: "modules.quickMath",
    component: PlaceholderModule,
  },
  {
    id: "geography",
    title: "Geografía",
    shortDescription: "Aprende países, capitales y mapas.",
    longDescription: "Un futuro módulo para explorar lugares, banderas, capitales y mapas.",
    category: "Conocimiento",
    route: "/modules/geography",
    icon: Map,
    status: "coming-soon",
    version: "0.1.0",
    storageNamespace: "modules.geography",
    component: PlaceholderModule,
  },
  {
    id: "reading",
    title: "Lectura",
    shortDescription: "Practica comprensión lectora con textos cortos.",
    longDescription: "Un futuro módulo con textos breves, preguntas y repaso de comprensión.",
    category: "Lengua",
    route: "/modules/reading",
    icon: BookOpen,
    status: "coming-soon",
    version: "0.1.0",
    storageNamespace: "modules.reading",
    component: PlaceholderModule,
  },
];

export function getModuleById(moduleId: string): EducationalModuleManifest | undefined {
  return moduleRegistry.find((module) => module.id === moduleId);
}
