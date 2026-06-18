import { act, fireEvent, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { NifVerificationField } from "@/components/common/nif-verification-field";
import { contributorService } from "@/services/contributor-service";
import { toast } from "sonner";

jest.mock("sonner", () => ({
  toast: {
    warning: jest.fn(),
  },
}));
jest.mock("@/services/contributor-service", () => {
  const actual = jest.requireActual("@/services/contributor-service");
  return {
    ...actual,
    contributorService: { verify: jest.fn() },
  };
});

const mockedVerify = contributorService.verify as jest.Mock;

function TestField({ onVerified = jest.fn() }: { onVerified?: jest.Mock }) {
  const [value, setValue] = useState("");
  const client = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  return (
    <QueryClientProvider client={client}>
      <NifVerificationField
        value={value}
        onChange={setValue}
        onVerified={onVerified}
      />
    </QueryClientProvider>
  );
}

describe("NifVerificationField", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockedVerify.mockReset();
    (toast.warning as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("consulta automaticamente e devolve o nome fiscal", async () => {
    const onVerified = jest.fn();
    mockedVerify.mockResolvedValue({
      taxNumber: "5000012345",
      name: "Empresa Confirmada",
      taxpayerType: "COLLECTIVE",
      status: "A",
      vatRegime: "GNAD",
      nonResident: false,
      hasRestrictions: false,
    });
    render(<TestField onVerified={onVerified} />);

    fireEvent.change(screen.getByPlaceholderText("Introduza o NIF"), {
      target: { value: "5000012345" },
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(mockedVerify).toHaveBeenCalledWith("5000012345", expect.any(AbortSignal));
    expect(onVerified).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Empresa Confirmada" }),
    );
    expect(await screen.findByText("NIF confirmado com sucesso.")).toBeInTheDocument();
  });

  it("não consulta o NIF interno do Consumidor Final", async () => {
    render(<TestField />);

    fireEvent.change(screen.getByPlaceholderText("Introduza o NIF"), {
      target: { value: "999999999" },
    });
    await act(async () => {
      jest.advanceTimersByTime(600);
    });

    expect(mockedVerify).not.toHaveBeenCalled();
  });

  it("apresenta falhas técnicas num aviso flutuante", async () => {
    mockedVerify.mockRejectedValue(new Error("Serviço indisponível."));
    render(<TestField />);

    fireEvent.change(screen.getByPlaceholderText("Introduza o NIF"), {
      target: { value: "5000012345" },
    });
    await act(async () => {
      jest.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(toast.warning).toHaveBeenCalledWith("Serviço indisponível.");
    expect(
      screen.getByRole("button", { name: "Repetir" }),
    ).toBeInTheDocument();
  });
});
