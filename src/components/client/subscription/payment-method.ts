import { MethodName, Method } from "@/types";

type MyMethod = Record<MethodName, Method>;

export const paymentMethods: MyMethod = {
   "Kwik": {
    name: "Kwik",
    icon: "kwik.png",
    description: "Pagamento via Kwik",
    info: "Efetue a transferência para o IBAN indicado abaixo. O pagamento é verificado instantaneamente pela nossa equipa.",
    processingTime: "Instantâneo",
    reference: "000500000933180510115",
    owner: "MINDWARE - Comércio e Serviços",
  },
  "Express": {
    name: "Express",
    icon: "express.png",
    description: "Pagamento instantâneo",
    info: "Efetue o pagamento Express para o número de telefone indicado abaixo. O pagamento é verificado instantaneamente.",
    processingTime: "Instantâneo",
    reference: "926 898 800",
    owner: "MINDWARE - Comércio e Serviços",
  },
};