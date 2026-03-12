import { FastifyInstance } from 'fastify'
import { ZodTypeProvider } from 'fastify-type-provider-zod'
import { listBudgets } from '../functions/list-budgets'
import {
  internalServerErrorSchema,
  listBudgetsQuerySchema,
  listBudgetsResponseSchema,
} from '../shared/schemas/budgets'
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'

export const listBudgetsRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/budgets',
    {
      schema: {
        summary: 'List budgets with pagination and filters',
        tags: ['Budgets'],
        querystring: listBudgetsQuerySchema,
        response: {
          200: listBudgetsResponseSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { page, name, status } = request.query

      try {
        const { budgets, metas } = await listBudgets({ page, name, status })

        return reply.status(200).send({
          budgets,
          metas,
        })
      } catch (error) {
        console.error(error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao listar orçamentos' })
      }
    },
  )
}
