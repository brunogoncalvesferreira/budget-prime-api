import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  budgetByIdSchema,
  getBudgetByIdResponseSchema,
  notFoundBudgetErrorSchema,
} from '../shared/schemas/budgets'
import { getBudgetById } from '../functions/get-budget-by-id'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'

export const getBudgetByIdRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/budgets/:id',
    {
      schema: {
        summary: 'Get a budget by ID',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: getBudgetByIdResponseSchema,
          404: notFoundBudgetErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { budget } = await getBudgetById({ id })

        return reply.status(200).send({ budget })
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }
      }
    },
  )
}
