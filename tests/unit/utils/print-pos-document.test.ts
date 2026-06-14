import { downloadDocument } from "@/services";
import { printPosDocument } from "@/utils/print-pos-document";
import printJS from "print-js";

jest.mock("@/services", () => ({
  downloadDocument: jest.fn(),
}));

jest.mock("print-js", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockedDownloadDocument = jest.mocked(downloadDocument);
const mockedPrintJS = jest.mocked(printJS);
const createObjectURL = jest.fn(() => "blob:documento");
const revokeObjectURL = jest.fn();

Object.defineProperties(URL, {
  createObjectURL: { configurable: true, value: createObjectURL },
  revokeObjectURL: { configurable: true, value: revokeObjectURL },
});

describe("printPosDocument", () => {
  beforeEach(() => {
    createObjectURL.mockClear();
    revokeObjectURL.mockClear();
    mockedDownloadDocument.mockResolvedValue({ data: new Blob(["pdf"]) } as never);
  });

  it("usa o formato de talão para a impressora térmica", async () => {
    mockedPrintJS.mockImplementation((options: any) => {
      options.onPrintDialogClose();
    });

    await printPosDocument({
      id: "invoice-id",
      type: "invoice-receipt",
      thermal: true,
    });

    expect(mockedDownloadDocument).toHaveBeenCalledWith(
      "invoice-id",
      "invoice-receipt",
      "thermal",
    );
    expect(mockedPrintJS).toHaveBeenCalledWith(
      expect.objectContaining({ printable: "blob:documento", type: "pdf" }),
    );
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:documento");
  });

  it("usa o PDF A4 e o recurso nativo do navegador para impressão padrão", async () => {
    let afterPrint: (() => void) | undefined;
    const print = jest.fn(() => afterPrint?.());
    const addEventListener = jest.fn(
      (_event: string, callback: () => void) => {
        afterPrint = callback;
      },
    );

    const promise = printPosDocument({
      id: "invoice-id",
      type: "invoice-receipt",
      thermal: false,
    });
    await Promise.resolve();

    const frame = document.querySelector("iframe");
    expect(frame).not.toBeNull();
    Object.defineProperty(frame, "contentWindow", {
      configurable: true,
      value: { addEventListener, focus: jest.fn(), print },
    });
    frame?.onload?.(new Event("load"));
    await promise;

    expect(mockedDownloadDocument).toHaveBeenCalledWith(
      "invoice-id",
      "invoice-receipt",
      "pdf",
    );
    expect(print).toHaveBeenCalledTimes(1);
    expect(document.querySelector("iframe")).toBeNull();
  });
});
