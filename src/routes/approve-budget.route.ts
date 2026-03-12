import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import { approveBudget } from '../functions/approve-budget'
import {
  approveBudgetResponseSchema,
  budgetByIdSchema,
  internalServerErrorSchema,
  notFoundBudgetErrorSchema,
} from '../shared/schemas/budgets'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'

export const approveBudgetRoute: FastifyPluginCallbackZod = (app) => {
  app.patch(
    '/budgets/:id/approve',
    {
      schema: {
        summary: 'Approve a budget',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: approveBudgetResponseSchema,
          404: notFoundBudgetErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { message } = await approveBudget(id)

        return reply.status(200).send({ message })
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error(error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao aprovar orçamento' })
      }
    },
  )

  app.get(
    '/budgets/:id/approve',
    {
      schema: {
        summary: 'Approve a budget (via link)',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: approveBudgetResponseSchema,
          404: notFoundBudgetErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { message } = await approveBudget(id)

        return reply.status(200).send({ message })
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error(error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao aprovar orçamento' })
      }
    },
  )
}
