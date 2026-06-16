"use client";

import { useMutation } from "@tanstack/react-query";
import { reportsService } from "@/services";
import type { ReportExportParams } from "@/types/reports";
import { triggerBrowserDownload } from "@/utils/donwload.file";

type ExportReportPayload = ReportExportParams & {
  filename: string;
};

export function useReportExport() {
  return useMutation({
    mutationFn: async ({ filename, ...params }: ExportReportPayload) => {
      const response = await reportsService.exportReport(params);
      triggerBrowserDownload(response, filename);
    },
  });
}
