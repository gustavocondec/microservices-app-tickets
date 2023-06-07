import express, { type Request, type Response } from 'express'
import { Ticket } from '../models/ticket'
import { NotFoundError } from '@gc-tickets/common'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)
  if (ticket == null) throw new NotFoundError()

  res.send(ticket)
})

export { router as showTicketRouter }
