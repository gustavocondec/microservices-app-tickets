import express, { type Request, type Response } from 'express'
import { currentUser } from '@gc-tickets/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req: Request, res: Response) => {
  return res.send({ currentUser: req.currentUser ?? null })
})

export { router as currentUserRouter }
