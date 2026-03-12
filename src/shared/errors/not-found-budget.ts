export class NotFoundBudgetError extends Error {
  constructor() {
    super('Orçamento não encontrado')
  }
}
