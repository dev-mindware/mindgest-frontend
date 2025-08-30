type SummaryCardProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export function SummaryCard({ label, value, highlight }: SummaryCardProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      <div
        className={`text-2xl font-bold p-3 rounded-lg 
          ${highlight
            ? "text-purple-600 bg-purple-50 border border-purple-200"
            : "text-gray-900 bg-gray-50 border"
          }`}
      >
        {value || "0.00"} Kz
      </div>
    </div>
  );
}
