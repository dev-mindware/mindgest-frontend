"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { TitleList, RequestError } from "@/components/common";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils";
import {
    Award,
    Mail,
    Calendar as CalendarIconLucide,
    CalendarIcon,
    ShoppingBag,
    BarChart3,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ClientAnalyticsResponse } from "@/types";

// Custom Dashboard Skeleton
function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <TitleList
                title="Relatórios de Clientes"
                suTitle="Análise de Clientes"
            />

            {/* Filters Skeleton */}
            <div className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-9 w-full" />
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Pie Chart + Top Client Grid Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Pie Chart Skeleton */}
                <Card className="col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-48" />
                        </div>
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent>
                        {/* Circular chart placeholder */}
                        <div className="flex items-center justify-center" style={{ height: 350 }}>
                            <Skeleton className="h-60 w-60 rounded-full" />
                        </div>

                        {/* Metrics Summary Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="text-center space-y-2">
                                    <Skeleton className="h-4 w-20 mx-auto" />
                                    <Skeleton className="h-6 w-28 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Top Client Card Skeleton */}
                <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-7 w-32" />
                                    <Skeleton className="h-5 w-20" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-3 w-3" />
                                    <Skeleton className="h-4 w-48" />
                                </div>
                            </div>
                            <Skeleton className="h-8 w-8 rounded-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Metrics Grid */}
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[1, 2].map((i) => (
                                    <div key={i} className="space-y-1">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Separator />

                        {/* Loyalty Score Skeleton */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-5 w-12" />
                            </div>
                            <Skeleton className="h-3 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tables Grid Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-4 w-28" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* Table Header */}
                            <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                            {/* Table Rows */}
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="grid grid-cols-3 gap-4 py-2">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-4 w-24 ml-auto" />
                                    <Skeleton className="h-4 w-8 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Preferred Products Skeleton */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-5 w-5" />
                            <Skeleton className="h-6 w-40" />
                        </div>
                        <Skeleton className="h-4 w-48" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {/* Table Header */}
                            <div className="grid grid-cols-3 gap-4 pb-2 border-b">
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-4 w-20 ml-auto" />
                                <Skeleton className="h-4 w-16 ml-auto" />
                            </div>
                            {/* Table Rows */}
                            {[1, 2].map((i) => (
                                <div key={i} className="grid grid-cols-3 gap-4 py-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-8 ml-auto" />
                                    <Skeleton className="h-4 w-24 ml-auto" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export function ClientsReportsContent() {
    const [reportType, setReportType] = useState("top");
    const [limit, setLimit] = useState("10");
    const [startDate, setStartDate] = useState<Date | undefined>(new Date(2024, 0, 1));
    const [endDate, setEndDate] = useState<Date | undefined>(new Date(2026, 11, 31));

    // Fetch client analytics data from API
    const { data, isLoading, isError, refetch } = useQuery<ClientAnalyticsResponse>({
        queryKey: ["client-analytics", reportType, limit, startDate, endDate],
        queryFn: async () => {
            const response = await api.get("/reports/client-analytics", {
                params: {
                    type: reportType,
                    limit: parseInt(limit),
                    startDate: startDate ? format(startDate, "yyyy-MM-dd") : undefined,
                    endDate: endDate ? format(endDate, "yyyy-MM-dd") : undefined,
                },
            });
            return response.data;
        },
        gcTime: 300_000, // cache: 5min
        retry: 1,
    });

    // Loading state
    if (isLoading) {
        return <DashboardSkeleton />;
    }

    // Error state
    if (isError || !data) {
        return (
            <div className="space-y-6">
                <TitleList
                    title="Relatórios de Clientes"
                    suTitle="Análise de Clientes"
                />
                <RequestError refetch={refetch} message="Erro ao carregar relatórios de clientes" />
            </div>
        );
    }

    const topClient = data.clients[0];

    // Prepare data for pie chart - usando tons de primary do globals.css
    const pieChartData = [
        { name: "Receita Total", value: data.summary.totalRevenue, color: "#b899ff" }, // primary-300
        { name: "Ticket Médio", value: data.summary.averageTicket, color: "#9956f6" }, // primary-500
        { name: "Clientes", value: data.summary.totalClients * 1000000, color: "#7c3aed" }, // primary-700
        { name: "Score Fidelização", value: data.summary.averageLoyaltyScore * 100000, color: "#5b21b6" }, // primary-900
    ];

    const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(dateString));
    };

    const formatMonth = (monthString: string) => {
        const [year, month] = monthString.split("-");
        return new Intl.DateTimeFormat("pt-PT", {
            month: "short",
            year: "numeric",
        }).format(new Date(parseInt(year), parseInt(month) - 1));
    };

    return (
        <div className="space-y-6">
            <TitleList
                title="Relatórios de Clientes"
                suTitle="Análise de Clientes"
            />

            {/* Filters Section */}
            <div className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Data Início
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {startDate ? format(startDate, "PPP") : <span>Selecione a data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Data Fim
                        </label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal">
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {endDate ? format(endDate, "PPP") : <span>Selecione a data</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Tipos de Clientes
                        </label>
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Tipos</SelectLabel>
                                    <SelectItem value="top">Top Clientes</SelectItem>
                                    <SelectItem value="recent">Recentes</SelectItem>
                                    <SelectItem value="inactive">Inativos</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                            Limite
                        </label>
                        <Select value={limit} onValueChange={setLimit}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Limites</SelectLabel>
                                    <SelectItem value="5">5</SelectItem>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="20">20</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Pie Chart - Distribuição de Métricas */}
                <Card className="col-span-2">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            <CardTitle>Distribuição de Métricas</CardTitle>
                        </div>
                        <CardDescription>Visão geral das principais métricas</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => entry.name}
                                    outerRadius={120}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Metrics Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Receita Total</p>
                                <p className="text-lg font-bold text-primary-300">
                                    {formatCurrency(data.summary.totalRevenue)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Ticket Médio</p>
                                <p className="text-lg font-bold text-primary-500">
                                    {formatCurrency(data.summary.averageTicket)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Total Clientes</p>
                                <p className="text-lg font-bold text-primary-700">
                                    {data.summary.totalClients}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground mb-1">Score Médio</p>
                                <p className="text-lg font-bold text-primary-900">
                                    {data.summary.averageLoyaltyScore}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Client Highlight */}
                {topClient && (
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <CardTitle className="text-2xl">
                                            {topClient.clientName}
                                        </CardTitle>
                                        <Badge variant="default" className="text-xs">
                                            Top Cliente
                                        </Badge>
                                    </div>
                                    <CardDescription className="flex items-center gap-2">
                                        <Mail className="h-3 w-3" />
                                        {topClient.clientEmail}
                                    </CardDescription>
                                </div>
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Receita Total</p>
                                        <p className="text-xl font-bold text-primary">
                                            {formatCurrency(topClient.totalRevenue)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Nº de Facturas</p>
                                        <p className="text-xl font-bold">{topClient.totalInvoices}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground">Valor Médio</p>
                                        <p className="text-xl font-bold">
                                            {formatCurrency(topClient.averageOrderValue)}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <CalendarIconLucide className="h-3 w-3" />
                                            Última Compra
                                        </p>
                                        <p className="text-xl font-bold">
                                            {formatDate(topClient.lastPurchaseDate)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium">Score de Fidelização</p>
                                    <Badge variant="success" className="text-sm">
                                        {topClient.loyaltyScore}%
                                    </Badge>
                                </div>
                                <Progress value={topClient.loyaltyScore} className="h-3" />
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Revenue */}
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
                                {topClient?.monthlyTrend.map((trend, index) => (
                                    <TableRow
                                        key={index}
                                        className={
                                            trend.revenue > 0 ? "bg-primary/5 font-medium" : ""
                                        }
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

                {/* Preferred Products */}
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
                                {topClient?.preferredItems
                                    .sort((a, b) => b.revenue - a.revenue)
                                    .map((item, index) => (
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
            </div>
        </div>
    );
}