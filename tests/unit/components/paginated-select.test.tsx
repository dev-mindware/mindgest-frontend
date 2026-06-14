import { render, screen } from "@testing-library/react";
import { PaginatedSelect } from "@/components/shared/filters/paginated-select";

jest.mock("@/components/ui/select", () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ placeholder }: { placeholder: string }) => <span>{placeholder}</span>,
}));

describe("PaginatedSelect", () => {
  it("apresenta a descrição da opção com tipografia secundária", () => {
    render(
      <PaginatedSelect
        options={[
          {
            value: "tax-id",
            label: "IVA (14%)",
            description: "Imposto sobre o valor acrescentado",
          },
        ]}
        onChange={jest.fn()}
        pagination={{ page: 1, totalPages: 1 }}
        onPageChange={jest.fn()}
      />,
    );

    const description = screen.getByText("Imposto sobre o valor acrescentado");
    expect(description).toHaveClass("text-xs", "text-muted-foreground");
  });
});
