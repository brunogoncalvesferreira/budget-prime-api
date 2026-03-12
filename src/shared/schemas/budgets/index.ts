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

export const listBudgetsQuerySchema = z.object({
  page: z.string().optional().default('1').transform(Number),
  name: z.string().optional(),
  status: z.enum(['DRAFT', 'SENT', 'APPROVED', 'REJECTED']).optional(),
})

export const listBudgetsResponseSchema = z.object({
  budgets: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      price: z.number(),
      deadLine: z.date(),
      status: z.string(),
      pdf_url: z.string().nullable(),
      createdAt: z.date(),
      clients: z
        .object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
        })
        .nullable(),
    }),
  ),
  metas: z.object({
    page: z.number(),
    perPage: z.number(),
    total: z.number(),
  }),
})

export const approveBudgetResponseSchema = z.object({
  message: z.string(),
})

export const rejectBudgetResponseSchema = z.object({
  message: z.string(),
})

export const sendBudgetWhatsappResponseSchema = z.object({
  whatsapp_url: z.url(),
})

export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>
export type BudgetByIdSchema = z.infer<typeof budgetByIdSchema>
export type ListBudgetsQuerySchema = z.infer<typeof listBudgetsQuerySchema>
export type ApproveBudgetResponseSchema = z.infer<
  typeof approveBudgetResponseSchema
>
export type RejectBudgetResponseSchema = z.infer<
  typeof rejectBudgetResponseSchema
>
export type SendBudgetWhatsappResponseSchema = z.infer<
  typeof sendBudgetWhatsappResponseSchema
>
