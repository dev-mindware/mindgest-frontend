/**
 * @jest-environment node
 */

import { getContributorByDocument } from "@/services/setic/setic-client";
import { mapSeticToVerifiedContributor } from "@/services/setic/setic.mapper";

const runLiveSeticTests = process.env.RUN_LIVE_SETIC_TESTS === "1";
const describeIfLive = runLiveSeticTests ? describe : describe.skip;

describeIfLive("SETIC client (live)", () => {
  it("consulta o NIF 007875745LA046 com autenticação Basic", async () => {
    const data = await getContributorByDocument({
      tipoDocumento: "NIF",
      numeroDocumento: "007875745LA046",
    });

    expect(data.ObterContribuinte.mensagem).toBeTruthy();
    expect(data.ObterContribuinte.contribuinte.numeroNIF).toBe("007875745LA046");

    const verified = mapSeticToVerifiedContributor(data.ObterContribuinte.contribuinte);
    expect(verified.name).toBeTruthy();
    expect(verified.status).toBe("A");
    expect(verified.nonResident).toBe(false);
    expect(verified.hasRestrictions).toBe(false);
  }, 20_000);
});
