import { prisma } from '../lib/prisma'
import { AlreadyExistEmailClientError } from '../shared/errors/already-exist-email-client'
import { ClientSchema } from '../shared/schemas/clients'

export async function createClients({
  name,
  email,
  phone,
  usersId,
}: ClientSchema) {
  const clientExist = await prisma.clients.findUnique({
    where: { email },
  })

  if (clientExist) {
    throw new AlreadyExistEmailClientError()
  }

  await prisma.clients.create({
    data: {
      name,
      email,
      phone,
      usersId,
    },
  })

  return {
    message: 'Cliente cadastrado com sucesso',
  }
}
