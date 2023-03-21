import { CustomError } from './custom-error'

export class NotFoundError extends CustomError {
  statusCode = 404
  constructor () {
    super('Not Found')
  }

  serializeErrors (): Array<{ message: string, field?: string }> {
    return [{ message: this.message }]
  }
}
