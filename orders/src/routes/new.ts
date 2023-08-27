import express, { type Request, type Response } from 'express'
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@gc-tickets/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
import { kafkaWrapper } from '../kafka-wrapper'

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15 * 60

router.post('/api/orders', requireAuth, [
  body('ticketId')
    .not().isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided')
], validateRequest, async (req: Request, res: Response): Promise<void> => {
  const { ticketId } = req.body

  const ticket = await Ticket.findById(ticketId)
  if (ticket == null) {
    throw new NotFoundError()
  }
  if (await ticket.isReserved()) throw new BadRequestError('Ticket is already reserved')

  const expiration = new Date()
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  })

  await order.save()

  await new OrderCreatedPublisher(kafkaWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    expiresAt: order.expiresAt.toISOString(),
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  })

  res.status(201).send(order)
})

export { router as newOrderRouter }
