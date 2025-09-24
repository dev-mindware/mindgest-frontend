import { Stats } from "@/types";
import { Icon } from "@/components/common";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type Props = {
  stat: Stats;
};

export function CardStat({ stat }: Props) {
  return (
    <Card
      key={stat.title}
      className="overflow-hidden border border-border shadow-sm hover:shadow-md transition-all duration-300 relative"
    >
      <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-primary-600 dark:from-primary-500 dark:to-primary-700" />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold text-muted-foreground">
          {stat.title}
        </CardTitle>
        <div className="p-1.5 rounded-full bg-primary-300/10 dark:bg-primary-900/40">
          <Icon name={stat.icon} className={`h-4 w-4 text-primary-500`} />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {stat.value}
        </div>
      </CardContent>
    </Card>
  );
}
