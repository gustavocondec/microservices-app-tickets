import { type NextFunction, type Request, type Response } from 'express'
import jwt from 'jsonwebtoken'

interface UserPayload {
  id: string
  email: string
}

// Permite añadirle la propiedad currentUser al interfaz existente
declare global{
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express{
    interface Request {
      currentUser?: UserPayload
    }
  }
}

// Solo busca añadir field currentUser al req. (No se encarga de lanzar error x no estar autenticado
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if (req.session?.jwt == null) { next(); return }
  try {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
  } catch (e) {
  }

  next()
}
