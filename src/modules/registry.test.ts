import { describe, expect, it } from "vitest";
import { moduleRegistry } from "./registry";

describe("module registry", () => {
  it("keeps module manifests complete", () => {
    for (const module of moduleRegistry) {
      expect(module.id).toBeTruthy();
      expect(module.title).toBeTruthy();
      expect(module.shortDescription).toBeTruthy();
      expect(module.category).toBeTruthy();
      expect(module.route).toContain(module.id);
      expect(module.version).toBeTruthy();
      expect(module.storageNamespace).toBeTruthy();
      expect(["active", "coming-soon", "disabled"]).toContain(module.status);
      expect(module.component).toBeTruthy();
    }
  });

  it("registers future modules as coming soon", () => {
    expect(moduleRegistry.find((module) => module.id === "quick-math")?.status).toBe("coming-soon");
    expect(moduleRegistry.find((module) => module.id === "geography")?.status).toBe("coming-soon");
    expect(moduleRegistry.find((module) => module.id === "reading")?.status).toBe("coming-soon");
  });
});
