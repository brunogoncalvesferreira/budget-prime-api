import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod'
import {
  userErrorSchema,
  userResponseSchema,
  userSchema,
} from '../shared/schemas/users'
import { AlreadyExistEmailUserError } from '../shared/errors/already-exist-email-user'
import { createUsers } from '../functions/create-users'

export const createUsersRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    '/users',
    {
      schema: {
        tags: ['Users'],
        summary: 'Create new user',
        body: userSchema,
        response: {
          201: userResponseSchema,
          409: userErrorSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, company_name, email, password } = request.body

      try {
        const { message } = await createUsers({
          name,
          company_name,
          email,
          password,
        })

        return reply.status(201).send({ message })
      } catch (error) {
        if (error instanceof AlreadyExistEmailUserError) {
          return reply.status(409).send({ message: error.message })
        }
      }
    },
  )
}
