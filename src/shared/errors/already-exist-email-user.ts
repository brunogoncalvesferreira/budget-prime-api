export class AlreadyExistEmailUserError extends Error {
  constructor() {
    super('Já existe um usuário com este e-mail')
    this.name = 'AlreadyEmailUserError'
  }
}
