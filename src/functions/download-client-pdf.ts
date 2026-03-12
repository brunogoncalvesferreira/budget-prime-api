import { prisma } from '../lib/prisma'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'
import path from 'node:path'
import fs from 'node:fs'

interface DownloadBudgetPdfParams {
  id: string
}

export async function downloadBudgetPdf({ id }: DownloadBudgetPdfParams) {
  const budget = await prisma.budgets.findUnique({
    where: { id },
  })

  if (!budget) {
    throw new NotFoundBudgetError()
  }

  if (!budget.pdf_url) {
    throw new Error('PDF não gerado para este orçamento')
  }

  const filePath = path.resolve(
    process.cwd(),
    budget.pdf_url.startsWith('/') ? budget.pdf_url.slice(1) : budget.pdf_url,
  )

  if (!fs.existsSync(filePath)) {
    throw new Error('Arquivo PDF não encontrado no servidor')
  }

  return { filePath, fileName: path.basename(filePath) }
}
