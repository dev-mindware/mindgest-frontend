"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { BarChart3 } from "lucide-react";
import { formatCurrency } from "@/utils";

interface MonthlyTrend {
    month: string;
    revenue: number;
    invoices: number;
}

interface MonthlyRevenueTableProps {
    monthlyTrend: MonthlyTrend[];
}

export function MonthlyRevenueTable({ monthlyTrend }: MonthlyRevenueTableProps) {
    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split("-");
        return new Intl.DateTimeFormat("pt-PT", {
            month: "short",
            year: "numeric",
        }).format(new Date(parseInt(year), parseInt(month) - 1));
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Receita Mensal</CardTitle>
                </div>
                <CardDescription>Últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Mês</TableHead>
                            <TableHead className="text-right">Receita</TableHead>
                            <TableHead className="text-right">Facturas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monthlyTrend.map((trend, index) => (
                            <TableRow
                                key={index}
                                className={trend.revenue > 0 ? "bg-primary/5 font-medium" : ""}
                            >
                                <TableCell>{formatMonth(trend.month)}</TableCell>
                                <TableCell className="text-right">
                                    {trend.revenue > 0 ? formatCurrency(trend.revenue) : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    {trend.invoices > 0 ? trend.invoices : "-"}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
