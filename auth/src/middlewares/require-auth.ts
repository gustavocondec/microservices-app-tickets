import { type NextFunction, type Request, type Response } from 'express'
import { NotAuthorizedError } from '../errors/not-authorized-error'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.currentUser == null) {
    throw new NotAuthorizedError()
  }
  next()
}
