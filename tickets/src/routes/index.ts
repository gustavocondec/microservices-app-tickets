import express, { type Request, type Response } from 'express'
import { Ticket } from '../models/ticket'

const router = express.Router()
// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.get('/api/tickets', async (req: Request, res: Response) => {
  const tickets = await Ticket.find({})
  res.send(tickets)
})

export { router as indexTicketRouter }
