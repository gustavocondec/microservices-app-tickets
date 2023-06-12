import express, { type Request, response, type Response } from 'express'
import { body } from 'express-validator'
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError
} from '@gc-tickets/common'
import { Ticket } from '../models/ticket'
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher'
import { kafkaWrapper } from '../kafka-wrapper'

const router = express.Router()

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.put('/api/tickets/:id', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
// eslint-disable-next-line @typescript-eslint/no-misused-promises
], validateRequest, async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params.id)
  if (ticket == null) throw new NotFoundError()
  if (ticket.userId !== req.currentUser?.id) throw new NotAuthorizedError()

  ticket.set({
    title: req.body.title,
    price: req.body.price
  })

  await ticket.save()
  await new TicketUpdatedPublisher(kafkaWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId
  })

  res.send(ticket)
})

export { router as updateTicketRouter }
