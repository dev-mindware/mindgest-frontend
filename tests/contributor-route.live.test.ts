/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { POST } from "@/app/api/contributors/verify/route";

const runLiveSeticTests = process.env.RUN_LIVE_SETIC_TESTS === "1";
const describeIfLive = runLiveSeticTests ? describe : describe.skip;

function createLiveRequest(taxNumber: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return new NextRequest(`${appUrl}/api/contributors/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      origin: appUrl,
      "x-forwarded-for": `live-${taxNumber}-${Date.now()}`,
    },
    body: JSON.stringify({ taxNumber }),
  });
}

describeIfLive("POST /api/contributors/verify (live)", () => {
  it("consulta ponta a ponta o NIF 5002464497 no serviço SETIC-FP", async () => {
    const taxNumber = "5002464497";

    const response = await POST(createLiveRequest(taxNumber));
    const body = await response.json();

    expect([200, 404, 429, 503]).toContain(response.status);

    if (response.status === 200) {
      expect(body).toEqual(
        expect.objectContaining({
          taxNumber,
          name: expect.any(String),
          status: expect.any(String),
          vatRegime: expect.any(String),
          taxpayerType: expect.any(String),
          nonResident: expect.any(Boolean),
          hasRestrictions: expect.any(Boolean),
        }),
      );
      return;
    }

    expect(body).toEqual(
      expect.objectContaining({
        code: expect.any(String),
        message: expect.any(String),
      }),
    );
  }, 20_000);
});
