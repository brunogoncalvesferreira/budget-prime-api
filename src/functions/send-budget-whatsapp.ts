import 'dotenv/config'
import { prisma } from '../lib/prisma'
import { NotFoundBudgetError } from '../shared/errors/not-found-budget'
import { env } from '../env'

export async function sendBudgetWhatsapp(id: string) {
  const budget = await prisma.budgets.findUnique({
    where: { id },
    include: {
      clients: true,
    },
  })

  if (!budget || !budget.clients) {
    throw new NotFoundBudgetError()
  }

  const phone = budget.clients.phone.replace(/\D/g, '')
  const frontendUrl = env.FRONTEND_URL
  const baseUrl = env.BASE_URL

  const downloadUrl = `${baseUrl}/budgets/${id}/download`
  const approveUrl = `${frontendUrl}/budgets/approve/${id}`

  const message = `Olá ${budget.clients.name}! Segue o link para o seu orçamento:
  
📥 Baixar PDF: 
 ${downloadUrl}
✅ Aprovar Orçamento: 
 ${approveUrl}

Obrigado!`

  const encodedMessage = encodeURIComponent(message)
  const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`

  return {
    whatsapp_url: whatsappUrl,
  }
}
