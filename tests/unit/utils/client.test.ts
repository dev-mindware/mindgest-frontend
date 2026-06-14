import {
  excludeFinalConsumer,
  isFinalConsumerClient,
  isSelectableClient,
} from "@/utils/client";

describe("regras de apresentação de clientes", () => {
  it("identifica o Consumidor Final apenas pelo NIF reservado", () => {
    const clientWithReservedName = {
      name: "Consumidor Final",
      taxNumber: "5000000000",
    };

    expect(isFinalConsumerClient({ taxNumber: "999999999" })).toBe(true);
    expect(isFinalConsumerClient(clientWithReservedName)).toBe(false);
  });

  it("remove apenas o cliente com o NIF reservado", () => {
    const clients = [
      { id: "1", name: "Consumidor Final", taxNumber: "999999999" },
      { id: "2", name: "Consumidor Final", taxNumber: "5000000000" },
      { id: "3", name: "Cliente Empresa", taxNumber: "5417000000" },
    ];

    expect(excludeFinalConsumer(clients).map((client) => client.id)).toEqual([
      "2",
      "3",
    ]);
    expect(isSelectableClient(clients[0])).toBe(false);
  });
});
