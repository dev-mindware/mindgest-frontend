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
import { ShoppingBag } from "lucide-react";
import { formatCurrency } from "@/utils";

interface PreferredItem {
    itemName: string;
    quantity: number;
    revenue: number;
}

interface PreferredProductsTableProps {
    preferredItems: PreferredItem[];
}

export function PreferredProductsTable({ preferredItems }: PreferredProductsTableProps) {
    const sortedItems = [...preferredItems].sort((a, b) => b.revenue - a.revenue);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" />
                    <CardTitle>Produtos Preferidos</CardTitle>
                </div>
                <CardDescription>Mais comprados pelo cliente</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Quantidade</TableHead>
                            <TableHead className="text-right">Receita</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedItems.map((item, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">
                                    {item.itemName}
                                </TableCell>
                                <TableCell className="text-right">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-primary">
                                    {formatCurrency(item.revenue)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
