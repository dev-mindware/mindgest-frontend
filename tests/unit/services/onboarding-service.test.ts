import { api } from "@/services/api";
import { onboardingService } from "@/services/onboarding-service";

jest.mock("@/services/api", () => ({
  api: {
    get: jest.fn(),
    patch: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockedApi = api as jest.Mocked<typeof api>;

describe("onboardingService", () => {
  it("obtém preferências e progresso", async () => {
    const payload = {
      preferences: {
        autoStartEnabled: true,
        tourButtonEnabled: false,
      },
      tours: {
        dashboard: {
          status: "completed" as const,
          tourVersion: 1,
        },
      },
    };
    mockedApi.get.mockResolvedValueOnce({ data: { data: payload } } as never);

    await expect(onboardingService.getPreferences()).resolves.toEqual(payload);
    expect(mockedApi.get).toHaveBeenCalledWith("/onboarding");
  });

  it("actualiza preferências parciais", async () => {
    mockedApi.patch.mockResolvedValueOnce({
      data: { autoStartEnabled: false, tourButtonEnabled: true },
    } as never);

    await onboardingService.updatePreferences({ autoStartEnabled: false });

    expect(mockedApi.patch).toHaveBeenCalledWith("/onboarding/preferences", {
      autoStartEnabled: false,
    });
  });

  it("regista o progresso de um guia de forma idempotente", async () => {
    const progress = {
      status: "in_progress" as const,
      mode: "demo" as const,
      lastStepIndex: 2,
      tourVersion: 1,
    };
    mockedApi.put.mockResolvedValueOnce({ data: progress } as never);

    await onboardingService.updateTour("normal-invoice", progress);

    expect(mockedApi.put).toHaveBeenCalledWith(
      "/onboarding/tours/normal-invoice",
      progress,
    );
  });

  it("repõe um guia ou todos os guias", async () => {
    mockedApi.delete.mockResolvedValue({} as never);

    await onboardingService.resetTour("dashboard");
    await onboardingService.resetAllTours();

    expect(mockedApi.delete).toHaveBeenNthCalledWith(
      1,
      "/onboarding/tours/dashboard",
    );
    expect(mockedApi.delete).toHaveBeenNthCalledWith(2, "/onboarding/tours");
  });
});
