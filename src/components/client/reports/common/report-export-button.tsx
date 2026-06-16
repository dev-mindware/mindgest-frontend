"use client";

import { format } from "date-fns";
import { toast } from "sonner";
import { Button, Icon } from "@/components";
import { useReportExport } from "@/hooks/reports";
import type { ReportExportType } from "@/types/reports";

interface ReportExportButtonProps {
  reportType: ReportExportType;
  startDate?: Date;
  endDate?: Date;
  filenamePrefix?: string;
  className?: string;
}

export function ReportExportButton({
  reportType,
  startDate,
  endDate,
  filenamePrefix,
  className,
}: ReportExportButtonProps) {
  const { mutate, isPending } = useReportExport();
  const hasRequiredDates = Boolean(startDate && endDate);

  function handleExport() {
    if (!startDate || !endDate) {
      toast.error("Seleccione a data inicial e final para exportar.");
      return;
    }

    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    const formattedEndDate = format(endDate, "yyyy-MM-dd");

    mutate(
      {
        reportType,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        filename: `${filenamePrefix ?? reportType.toLowerCase()}-${formattedStartDate}-${formattedEndDate}.pdf`,
      },
      {
        onError: () => {
          toast.error("Não foi possível exportar o relatório.");
        },
      },
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleExport}
      loading={isPending}
      disabled={!hasRequiredDates || isPending}
    >
      <Icon name="Download" className="w-4 h-4" />
      Exportar
    </Button>
  );
}
