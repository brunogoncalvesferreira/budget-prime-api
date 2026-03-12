import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  createBudgetResponseSchema,
  createBudgetSchema,
} from '../shared/schemas/budgets'
import { createBudgets } from '../functions/create-budgets'
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'

export const createBudgetsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/budgets',
    {
      schema: {
        summary: 'Create a new budget',
        tags: ['Budgets'],
        body: createBudgetSchema,
        response: {
          201: createBudgetResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { description, price, deadLine, usersId, clientsId } = request.body

      const { message, pdf_url, budget_id } = await createBudgets({
        description,
        price,
        deadLine,
        usersId,
        clientsId,
      })

      return reply.status(201).send({ message, pdf_url, budget_id })
    },
  )
}
