import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@gc-tickets/common'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher'
import { kafkaWrapper } from '../kafka-wrapper'

const router = express.Router()

router.post('/api/tickets', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0.')
// eslint-disable-next-line @typescript-eslint/no-misused-promises
], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body

  const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
  })
  await ticket.save()
  await new TicketCreatedPublisher(kafkaWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })
  res.status(201).send(ticket)
})

export { router as createTicketRouter }
