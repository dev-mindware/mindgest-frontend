import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface StatCardProps {
  label: string
  value: string
  trend: string
  trendIcon: React.ElementType
  trendPositive: boolean
  footerMain: string
  footerSub: string
}

export function StatCard({
  label,
  value,
  trend,
  trendIcon: Icon,
  trendPositive,
  footerMain,
  footerSub,
}: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
            <Icon className="size-4" />
          {/* <Badge variant={trendPositive ? "outline" : "destructive"}>
            {trend}
          </Badge> */}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
      {/*   <div className="flex gap-2 font-medium line-clamp-1">
          {footerMain} <Icon className="size-4" />
        </div> */}
       <div className="text-muted-foreground">{footerSub}</div> 
      </CardFooter>
    </Card>
  )
}
