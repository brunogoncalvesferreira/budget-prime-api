import { prisma } from '../lib/prisma'
import { ListBudgetsQuerySchema } from '../shared/schemas/budgets'

export async function listBudgets({
  page,
  name,
  status,
}: ListBudgetsQuerySchema) {
  const perPage = 10
  const skip = (page - 1) * perPage

  const where = {
    AND: [
      name
        ? {
            clients: {
              name: {
                contains: name,
                mode: 'insensitive' as const,
              },
            },
          }
        : {},
      status ? { status } : {},
    ],
  }

  const [budgets, total] = await Promise.all([
    prisma.budgets.findMany({
      where,
      include: {
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: perPage,
    }),
    prisma.budgets.count({ where }),
  ])

  return {
    budgets,
    metas: {
      page,
      perPage,
      total,
    },
  }
}
