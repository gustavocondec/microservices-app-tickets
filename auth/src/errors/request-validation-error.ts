import { type ValidationError } from 'express-validator'
import { CustomError } from './custom-error'

export class RequestValidationError extends CustomError {
  statusCode = 400
  constructor (public readonly errors: ValidationError[]) {
    super()

    // Only Because we are extending a built in class
    // Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors (): Array<{ field: string, message: string }> {
    return this.errors.map(err => ({ message: err.msg, field: err.param }))
  }
}
