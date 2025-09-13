
import { Stats } from "@/types";
import { Icon, Card, CardContent, CardHeader, CardTitle } from "@/components";

type Props = {
  stat: Stats
};

export function CardStat({ stat }: Props) {
  return (
    <Card
      key={stat.title}
      className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300"
    >
      <div className={`h-1 w-full ${stat.bgColor}`}></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pt-4 pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700">
          {stat.title}
        </CardTitle>
        <div className={`p-1.5 rounded-full ${stat.bgColor}`}>
          <Icon name={stat.icon} className={`h-4 w-4 ${stat.color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
          {stat.value}
        </div>
      </CardContent>
    </Card>
  );
}
