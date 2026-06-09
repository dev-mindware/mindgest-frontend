"use client";

import { StockList } from "./stock-list";
import { StockSummaryCharts } from "./stock-summary-charts";

export function StockManagementContent() {
    return (
        <div>
            <div data-tour="stock-summary">
                <StockSummaryCharts />
            </div>
            <div data-tour="stock-table">
                <StockList />
            </div>
        </div>
    );
}
