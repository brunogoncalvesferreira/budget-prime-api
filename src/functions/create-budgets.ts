import puppeteer from 'puppeteer'
import { prisma } from '../lib/prisma'
import { CreateBudgetSchema } from '../shared/schemas/budgets'
import path from 'node:path'

export async function createBudgets({
  description,
  price,
  deadLine,
  usersId,
  clientsId,
}: CreateBudgetSchema) {
  const budget = await prisma.budgets.create({
    data: {
      description,
      price,
      deadLine,
      usersId,
      clientsId,
      pdf_url: '', // Será atualizado após a geração do PDF
    },
    include: {
      users: true,
      clients: true,
    },
  })

  const fileName = `orc-${budget.clients?.name}.pdf`
  const filePath = path.resolve(process.cwd(), 'uploads', 'pdfs', fileName)

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()

  const htmlContent = `
    <!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@300;400;700&display=swap');

        :root {
            --bg: #050508;
            --surface: #0c0c12;
            --border: #1e1e2e;
            --accent: #00f5c4;
            --accent-dim: rgba(0, 245, 196, 0.08);
            --text-primary: #eeeef5;
            --text-secondary: #6e6e8a;
            --text-muted: #3a3a52;
        }

        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: 'Syne', sans-serif;
            background: var(--bg);
            color: var(--text-primary);
            padding: 56px 48px;
            min-height: 100vh;
            position: relative;
            overflow: hidden;
        }

        /* Grid background */
        body::before {
            content: '';
            position: fixed;
            inset: 0;
            background-image:
                linear-gradient(rgba(0,245,196,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,245,196,0.03) 1px, transparent 1px);
            background-size: 48px 48px;
            pointer-events: none;
        }

        /* Glow top-left */
        body::after {
            content: '';
            position: fixed;
            top: -120px;
            left: -120px;
            width: 400px;
            height: 400px;
            background: radial-gradient(circle, rgba(0,245,196,0.07) 0%, transparent 70%);
            pointer-events: none;
        }

        /* ── HEADER ── */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 48px;
            padding-bottom: 32px;
            border-bottom: 1px solid var(--border);
            position: relative;
        }

        .header::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            width: 80px;
            height: 1px;
            background: var(--accent);
        }

        .brand {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .brand-name {
            font-size: 11px;
            font-weight: 400;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--text-secondary);
        }

        .brand-company {
            font-size: 20px;
            font-weight: 700;
            color: var(--text-primary);
            letter-spacing: 0.02em;
        }

        .doc-id {
            text-align: right;
        }

        .doc-label {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 6px;
        }

        .doc-number {
            font-family: 'Space Mono', monospace;
            font-size: 22px;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: 0.05em;
        }

        /* ── STATUS BAR ── */
        .status-bar {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 40px;
            padding: 10px 16px;
            background: var(--accent-dim);
            border: 1px solid rgba(0,245,196,0.15);
            border-radius: 2px;
            width: fit-content;
        }

        .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: var(--accent);
        }

        .status-text {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: var(--accent);
        }

        /* ── GRID LAYOUT ── */
        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1px;
            background: var(--border);
            margin-bottom: 1px;
        }

        .grid-full {
            margin-bottom: 1px;
        }

        .cell {
            background: var(--surface);
            padding: 24px 28px;
        }

        .cell-label {
            font-family: 'Space Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--text-muted);
            margin-bottom: 10px;
        }

        .cell-value {
            font-size: 15px;
            font-weight: 400;
            color: var(--text-primary);
            line-height: 1.5;
        }

        .cell-value.mono {
            font-family: 'Space Mono', monospace;
            font-size: 13px;
        }

        /* ── DESCRIPTION ── */
        .desc-cell {
            background: var(--surface);
            padding: 28px;
            margin-bottom: 1px;
        }

        .desc-text {
            font-size: 14px;
            color: var(--text-secondary);
            line-height: 1.8;
            max-width: 680px;
        }

        /* ── VALUE ROW ── */
        .value-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: var(--surface);
            padding: 28px 28px;
            border-left: 2px solid var(--accent);
            margin-bottom: 1px;
        }

        .value-label {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--text-muted);
        }

        .value-amount {
            font-family: 'Space Mono', monospace;
            font-size: 28px;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: 0.03em;
        }

        .value-currency {
            font-size: 14px;
            opacity: 0.6;
            margin-right: 6px;
        }

        /* ── DEADLINE ── */
        .deadline-row {
            display: flex;
            align-items: center;
            gap: 28px;
            background: var(--surface);
            padding: 20px 28px;
            margin-bottom: 1px;
        }

        .deadline-label {
            font-family: 'Space Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--text-muted);
            min-width: 120px;
        }

        .deadline-value {
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            color: var(--text-primary);
        }

        /* ── FOOTER ── */
        .footer {
            margin-top: 48px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 20px;
            border-top: 1px solid var(--border);
        }

        .footer-left {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: var(--text-muted);
            letter-spacing: 0.08em;
        }

        .footer-right {
            font-family: 'Space Mono', monospace;
            font-size: 10px;
            color: var(--text-muted);
            letter-spacing: 0.08em;
        }

        .footer-accent {
            color: var(--accent);
            opacity: 0.7;
        }

        /* Corner decoration */
        .corner-mark {
            position: fixed;
            bottom: 40px;
            right: 48px;
            width: 40px;
            height: 40px;
            border-right: 1px solid var(--accent);
            border-bottom: 1px solid var(--accent);
            opacity: 0.3;
        }
    </style>
</head>
<body>

    <div class="header">
        <div class="brand">
            <div class="brand-name">Proposta Comercial</div>
            <div class="brand-company">${budget.users?.company_name || 'Budget Prime'}</div>
        </div>
        <div class="doc-id">
            <div class="doc-label">Orçamento</div>
            <div class="doc-number">#${budget.id.split('-')[0].toUpperCase()}</div>
        </div>
    </div>

    <div class="status-bar">
        <div class="status-dot"></div>
        <div class="status-text">Aguardando Aprovação</div>
    </div>

    <div class="grid-2">
        <div class="cell">
            <div class="cell-label">Cliente</div>
            <div class="cell-value">${budget.clients?.name}</div>
        </div>
        <div class="cell">
            <div class="cell-label">Contato</div>
            <div class="cell-value mono">${budget.clients?.email}</div>
        </div>
    </div>

    <div class="grid-2" style="margin-bottom: 24px;">
        <div class="cell">
            <div class="cell-label">Telefone</div>
            <div class="cell-value mono">${budget.clients?.phone}</div>
        </div>
        <div class="cell">
            <div class="cell-label">Data de Emissão</div>
            <div class="cell-value mono">${new Date().toLocaleDateString('pt-BR')}</div>
        </div>
    </div>

    <div class="desc-cell">
        <div class="cell-label">Descrição do Serviço</div>
        <div class="desc-text">${description}</div>
    </div>

    <div class="value-row">
        <div class="value-label">Valor Total</div>
        <div class="value-amount">
            <span class="value-currency">R$</span>${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </div>
    </div>

    <div class="deadline-row">
        <div class="deadline-label">Prazo de Entrega</div>
        <div class="deadline-value">${new Date(deadLine).toLocaleDateString('pt-BR')}</div>
    </div>

    <div class="footer">
        <div class="footer-left">Gerado em ${new Date().toLocaleString('pt-BR')}</div>
        <div class="footer-right"><span class="footer-accent">Budget Prime</span> &copy; ${new Date().getFullYear()}</div>
    </div>

    <div class="corner-mark"></div>

</body>
</html>
  `

  await page.setContent(htmlContent)
  await page.pdf({
    path: filePath,
    format: 'A4',
    printBackground: true,
  })

  await browser.close()

  const pdfUrl = `/uploads/pdfs/${fileName}`

  await prisma.budgets.update({
    where: { id: budget.id },
    data: { pdf_url: pdfUrl },
  })

  return {
    message: 'Orçamento criado com sucesso',
    pdf_url: pdfUrl,
    budget_id: budget.id,
  }
}
