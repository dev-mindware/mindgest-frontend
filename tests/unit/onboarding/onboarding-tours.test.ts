import { onboardingTours } from "@/constants/onboarding-tours";

describe("onboardingTours", () => {
  it("mantém um catálogo coerente e versionado", () => {
    const entries = Object.entries(onboardingTours);

    expect(entries).toHaveLength(21);
    expect(new Set(entries.map(([id]) => id)).size).toBe(entries.length);

    for (const [id, tour] of entries) {
      expect(tour.id).toBe(id);
      expect(tour.version).toBeGreaterThanOrEqual(1);
      expect(tour.priority).toBeGreaterThan(0);
      expect(tour.roles.length).toBeGreaterThan(0);
      expect(tour.steps.length).toBeGreaterThan(0);

      for (const step of tour.steps) {
        expect(step.selector).toMatch(/^\[data-tour="[^"]+"\]$/);
        expect(step.title.trim()).not.toBe("");
        expect(step.description.trim()).not.toBe("");
      }
    }
  });

  it("cobre os fluxos funcionais de continuidade", () => {
    expect(onboardingTours).toEqual(
      expect.objectContaining({
        dashboard: expect.any(Object),
        "proforma-edit": expect.any(Object),
        "credit-note": expect.any(Object),
        "supplier-details": expect.any(Object),
        "supplier-history": expect.any(Object),
      }),
    );
  });
});
