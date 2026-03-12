import { z } from 'zod'

export const createBudgetSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.number().min(0, 'Preço deve ser maior ou igual a zero'),
  deadLine: z.string().transform((val) => new Date(val)),
  usersId: z.uuid('ID do usuário inválido'),
  clientsId: z.uuid('ID do cliente inválido'),
})

export const budgetByIdSchema = z.object({
  id: z.uuid(),
})

export const createBudgetResponseSchema = z.object({
  message: z.string(),
  pdf_url: z.string(),
  budget_id: z.string(),
})

export const getBudgetByIdResponseSchema = z.object({
  budget: z.object({
    id: z.string(),
    description: z.string(),
    price: z.number(),
    deadLine: z.date(),
    users: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      })
      .nullable(),
    clients: z
      .object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        phone: z.string(),
      })
      .nullable(),
  }),
})

export const notFoundBudgetErrorSchema = z.object({
  message: z.string(),
})

export const internalServerErrorSchema = z.object({
  message: z.string(),
})

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>
export type BudgetByIdSchema = z.infer<typeof budgetByIdSchema>
