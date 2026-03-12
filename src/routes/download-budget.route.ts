import { z } from 'zod'
import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  budgetByIdSchema,
  internalServerErrorSchema,
  notFoundBudgetErrorSchema,
} from '../shared/schemas/budgets'
import { downloadBudgetPdf } from '../functions/download-client-pdf'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'
import fs from 'node:fs'

export const downloadBudgetRoute: FastifyPluginCallbackZod = (app) => {
  app.get(
    '/budgets/:id/download',
    {
      schema: {
        summary: 'Download a budget PDF',
        tags: ['Budgets'],
        params: budgetByIdSchema,
        response: {
          200: z.any().describe('The PDF file'),
          404: notFoundBudgetErrorSchema,
          500: internalServerErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      try {
        const { filePath, fileName } = await downloadBudgetPdf({ id })

        const fileBuffer = fs.readFileSync(filePath)

        return reply
          .status(200)
          .header('Content-Type', 'application/pdf')
          .header('Content-Disposition', `attachment; filename="${fileName}"`)
          .send(fileBuffer)
      } catch (error) {
        if (error instanceof NotFoundBudgetError) {
          return reply.status(404).send({ message: error.message })
        }
        return reply.status(500).send({
          message:
            error instanceof Error
              ? error.message
              : 'Erro interno ao baixar PDF',
        })
      }
    },
  )
}
