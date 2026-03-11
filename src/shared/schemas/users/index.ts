import z from 'zod'

export const userSchema = z.object({
  name: z.string(),
  company_name: z.string().optional(),
  email: z.email(),
  password: z.string().min(8, 'Adicione uma senha com pelo menos 8 caracteres'),
})

export const userByIdSchema = z.object({
  usersId: z.uuid(),
})

export const userResponseSchema = z.object({
  message: z.string(),
})

export const userErrorSchema = z.object({
  message: z.string(),
})

export type UserSchema = z.infer<typeof userSchema>
export type UserByIdSchema = z.infer<typeof userByIdSchema>
