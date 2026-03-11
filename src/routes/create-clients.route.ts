import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  clientErrorSchema,
  clientResponseSchema,
  clientSchema,
} from '../shared/schemas/clients'
import { AlreadyExistEmailClientError } from '../shared/errors/already-exist-email-client'
import { createClients } from '../functions/create-clients'

export const createClientsRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/clients',
    {
      schema: {
        tags: ['Clients'],
        description: 'Create new client for a user',
        body: clientSchema,
        response: {
          201: clientResponseSchema,
          400: clientErrorSchema,
          409: clientErrorSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, email, phone, usersId } = request.body

        const { message } = await createClients({
          name,
          email,
          phone,
          usersId,
        })

        return reply.status(201).send({ message })
      } catch (error) {
        if (error instanceof AlreadyExistEmailClientError) {
          return reply.status(409).send({ message: error.message })
        }

        return reply.status(400).send({ message: 'Erro ao cadastrar cliente' })
      }
    },
  )
}
