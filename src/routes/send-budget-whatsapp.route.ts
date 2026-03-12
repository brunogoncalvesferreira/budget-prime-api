import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  budgetByIdSchema,
  internalServerErrorSchema,
  notFoundBudgetErrorSchema,
  sendBudgetWhatsappResponseSchema,
} from '../shared/schemas/budgets'
import { sendBudgetWhatsapp } from '../functions/send-budget-whatsapp'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'

export const sendBudgetWhatsappRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/budgets/:id/send-whatsapp',
    {
      schema: {
        summary: 'Generate WhatsApp link for budget',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: sendBudgetWhatsappResponseSchema,
          404: notFoundBudgetErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { whatsapp_url } = await sendBudgetWhatsapp(id)

        return reply.status(200).send({ whatsapp_url })
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }

        console.error(error)
        return reply
          .status(500)
          .send({ message: 'Erro interno ao gerar link do WhatsApp' })
      }
    },
  )
}
