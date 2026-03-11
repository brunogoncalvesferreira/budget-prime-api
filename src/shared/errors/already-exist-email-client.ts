export class AlreadyExistEmailClientError extends Error {
  constructor() {
    super('E-mail já cadastrado para outro cliente')
  }
}
