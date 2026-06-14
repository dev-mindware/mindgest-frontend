import {
  getExpectedCashSessionEnd,
  isDuplicateOpeningRequestError,
} from "@/utils/cash-session";

describe("cash session utilities", () => {
  it("calcula o término previsto a partir da abertura e do expediente", () => {
    const result = getExpectedCashSessionEnd({
      openedAt: "2026-06-14T08:30:00.000Z",
      workTime: "08:15",
    });

    expect(result?.toISOString()).toBe("2026-06-14T16:45:00.000Z");
  });

  it("devolve null quando os dados do expediente são inválidos", () => {
    expect(
      getExpectedCashSessionEnd({ openedAt: "inválido", workTime: "08:00" }),
    ).toBeNull();
  });

  it.each([
    [{ response: { status: 409, data: {} } }],
    [{ response: { status: 400, data: { message: "Pedido pendente" } } }],
    [{ response: { status: 400, data: { message: "Já solicitou abertura" } } }],
  ])("identifica um pedido de abertura duplicado", (error) => {
    expect(isDuplicateOpeningRequestError(error)).toBe(true);
  });

  it("não classifica um erro genérico como pedido duplicado", () => {
    expect(
      isDuplicateOpeningRequestError({
        response: { status: 500, data: { message: "Erro interno" } },
      }),
    ).toBe(false);
  });
});
