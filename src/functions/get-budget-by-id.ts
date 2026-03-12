import { prisma } from '../lib/prisma'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'
import { BudgetByIdSchema } from '../shared/schemas/budgets'

export async function getBudgetById({ id }: BudgetByIdSchema) {
  const budget = await prisma.budgets.findUnique({
    where: { id },
    select: {
      id: true,
      description: true,
      price: true,
      deadLine: true,
      users: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      clients: {
        select: {
          id: true,
          name: true,
          phone: true,
          email: true,
        },
      },
    },
  })

  if (!budget) {
    throw new NotFoundBudgetError()
  }

  return { budget }
}
