/* import { Method } from "@/types";
import { formatCurrencyUSD } from "@/utils";

type Props = {
  totalToPay: number;
  currentMethod: Method;
};

export function PaymentInstruction({ currentMethod, totalToPay }: Props) {
  return (
    <div className="bg-yellow-50 p-4 rounded-lg">
      <h4 className="font-semibold text-yellow-800 mb-2">
        Instruções para Pagamento:
      </h4>
      <div className="text-sm text-yellow-700 space-y-1">
        <p>
          1. Realize o pagamento de{" "}
          <strong>{formatCurrencyUSD(totalToPay)}</strong> através do método{" "}
          {currentMethod.name}
        </p>
        <p>2. Baixe o PDF do comprovativo</p>
        <p>3. Envie o arquivo usando o campo acima</p>
        <p>4. Aguarde a confirmação do pagamento</p>
      </div>
    </div>
  );
}
 */