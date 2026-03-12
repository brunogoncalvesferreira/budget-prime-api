import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { rejectBudget } from '../functions/reject-budget'
import {
  rejectBudgetResponseSchema,
  budgetByIdSchema,
  internalServerErrorSchema,
  notFoundBudgetErrorSchema,
} from '../shared/schemas/budgets'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'

export const rejectBudgetRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/budgets/:id/reject',
    {
      schema: {
        summary: 'Reject a budget',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: rejectBudgetResponseSchema,
          404: notFoundBudgetErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { message } = await rejectBudget(id)

        return reply.status(200).send({ message })
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error(error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao rejeitar orçamento' })
      }
    },
  )
}
