/* import { Icon } from "@/components/icon";
import { Method } from "@/types";
import { formatCurrency } from "@/utils";

type Props = {
  currentMethod: Method;
};

export function PaymentMethodInformation({ currentMethod }: Props) {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Icon name={currentMethod.icon} className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            {currentMethod.name}
          </h3>
          <p className="text-sm text-blue-800 mb-2">{currentMethod.info}</p>
          <div className="flex items-center gap-4 text-xs text-blue-700">
            <span>
              <strong>Tempo:</strong> {currentMethod.processingTime}
            </span>
            <span>
              <strong>Taxa:</strong> {formatCurrency(currentMethod.fee)} 
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
 */