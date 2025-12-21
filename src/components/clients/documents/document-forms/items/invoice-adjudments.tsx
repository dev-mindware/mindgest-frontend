import { Input, SelectField } from "@/components";

interface Props {
  tax: number;
  retention: number;
  discount: number;
  setTax: (v: number) => void;
  setRetention: (v: number) => void;
  setDiscount: (v: number) => void;
}

export function InvoiceAdjustments({
  tax,
  retention,
  discount,
  setTax,
  setRetention,
  setDiscount,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg bg-card">
      <SelectField
        label="Imposto (IVA)"
        value={tax}
        onValueChange={(v) => setTax(Number(v))}
        options={[
          { value: 0, label: "Isento (0%)" },
          { value: 5, label: "5%" },
          { value: 7, label: "7%" },
          { value: 14, label: "14%" },
          { value: 20, label: "20%" },
        ]}
      />

      <SelectField
        label="Retenção"
        value={retention}
        onValueChange={(v) => setRetention(Number(v))}
        options={[
          { value: 0, label: "Sem retenção" },
          { value: 6.5, label: "6.5%" },
          { value: 10, label: "10%" },
        ]}
      />

      <Input
        type="number"
        label="Desconto (%)"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />
    </div>
  );
}
