import { fireEvent, render, screen } from "@testing-library/react";
import { PrintSaleDialog } from "@/components/client/pos/counter/cart/checkout-form/print-sale-dialog";
import type { usePosDocumentPrint } from "@/hooks/pos/use-pos-document-print";

type SalePrint = ReturnType<typeof usePosDocumentPrint>;

function createSalePrint(overrides: Partial<SalePrint> = {}): SalePrint {
  return {
    document: { id: "invoice-id", type: "invoice-receipt" },
    isPrinting: false,
    agentError: null,
    open: jest.fn(),
    close: jest.fn(),
    print: jest.fn(),
    printInBrowser: jest.fn(),
    ...overrides,
  };
}

describe("PrintSaleDialog", () => {
  it("pergunta se o documento deve ser impresso sem mostrar pré-visualização", () => {
    const salePrint = createSalePrint();

    render(<PrintSaleDialog print={salePrint} />);

    expect(
      screen.getByRole("heading", { name: "Deseja imprimir o documento?" }),
    ).toBeInTheDocument();
    expect(screen.queryByTitle(/pré-visualização/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Imprimir pelo browser" }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));
    expect(salePrint.print).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Agora não" }));
    expect(salePrint.close).toHaveBeenCalled();
  });

  it("depois de um erro do MindPrint oferece imprimir pelo browser, sem o abrir sozinho", () => {
    const salePrint = createSalePrint({
      agentError: "A impressora não respondeu.",
    });

    render(<PrintSaleDialog print={salePrint} />);

    expect(screen.getByText("A impressora não respondeu.")).toBeInTheDocument();
    expect(salePrint.printInBrowser).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Imprimir pelo browser" }));
    expect(salePrint.printInBrowser).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(salePrint.print).toHaveBeenCalledTimes(1);
  });

  it("mostra o estado de impressão em curso", () => {
    render(<PrintSaleDialog print={createSalePrint({ isPrinting: true })} />);
    expect(screen.getByRole("button", { name: "A imprimir…" })).toBeDisabled();
  });
});
