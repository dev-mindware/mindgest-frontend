import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().nonempty("Campo obrigatório"),
})

export type LoginFormData = z.infer<typeof loginSchema>



