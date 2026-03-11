import 'dotenv/config'
import { hash } from 'bcryptjs'
import { prisma } from '../src/lib/prisma'
import { env } from '../src/env'

export async function main() {
  const USER = {
    name: 'Bruno Gonçalves Ferreira',
    company_name: 'BG Coders',
    email: 'brunogonferreira@gmail.com',
    password: env.PASSWORD_SEED,
  }

  if (!USER.password) {
    throw new Error('PASSWORD environment variable is not defined')
  }

  const passwordHash = await hash(USER.password, 8)

  await prisma.users.create({
    data: {
      name: USER.name,
      company_name: USER.company_name,
      email: USER.email,
      password: passwordHash,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
