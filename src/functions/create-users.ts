import { hash } from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { AlreadyExistEmailUserError } from '../shared/errors/already-exist-email-user'
import { UserSchema } from '../shared/schemas/users'

export async function createUsers({
  name,
  company_name,
  password,
  email,
}: UserSchema) {
  const userExist = await prisma.users.findUnique({
    where: { email },
  })

  if (userExist) {
    throw new AlreadyExistEmailUserError()
  }

  const passwordHash = await hash(password, 8)

  await prisma.users.create({
    data: {
      name,
      company_name,
      email,
      password: passwordHash,
    },
  })

  return {
    message: 'Conta criada com sucesso',
  }
}
