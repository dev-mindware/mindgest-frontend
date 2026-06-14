import { fireEvent, render, screen } from "@testing-library/react";
import { PrintSaleDialog } from "@/components/client/pos/counter/cart/checkout-form/print-sale-dialog";

describe("PrintSaleDialog", () => {
  it("pergunta se o documento deve ser impresso sem mostrar pré-visualização", () => {
    const onPrint = jest.fn();
    const onDismiss = jest.fn();

    render(
      <PrintSaleDialog
        document={{ id: "invoice-id", type: "invoice-receipt" }}
        isPrinting={false}
        onPrint={onPrint}
        onDismiss={onDismiss}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Deseja imprimir o documento?" }),
    ).toBeInTheDocument();
    expect(screen.queryByTitle(/pré-visualização/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Imprimir" }));
    expect(onPrint).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Agora não" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
