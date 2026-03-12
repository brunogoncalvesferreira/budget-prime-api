import { prisma } from '../lib/prisma'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'

export async function approveBudget(id: string) {
  const budget = await prisma.budgets.findUnique({
    where: { id },
  })

  if (!budget) {
    throw new NotFoundBudgetError()
  }

  await prisma.budgets.update({
    where: { id },
    data: {
      status: 'APPROVED',
    },
  })

  return {
    message: 'Orçamento aprovado com sucesso',
  }
}
