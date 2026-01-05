"use client";

import { StockList } from "./stock-list";
import { StockSummaryCharts } from "./stock-summary-charts";

export function StockManagementContent() {
    return (
        <div className="p-6 space-y-8">
            <StockSummaryCharts />
            <StockList />
        </div>
    );
}