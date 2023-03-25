import { type NextFunction, type Request, type Response } from 'express'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('manejador errores ')
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() })
  }
  return res.status(500).send({ errors: [{ message: 'Error interno.' }] })
}
