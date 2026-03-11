import z from 'zod'

export const clientSchema = z.object({
  name: z.string(),
  email: z.email('E-mail inválido'),
  phone: z.string(),
  usersId: z.uuid('ID de usuário inválido'),
})

export const clientResponseSchema = z.object({
  message: z.string(),
})

export const clientErrorSchema = z.object({
  message: z.string(),
})

export type ClientSchema = z.infer<typeof clientSchema>
