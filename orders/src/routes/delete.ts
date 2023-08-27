import express, { type Request, type Response } from 'express'
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@gc-tickets/common'
import { Order } from '../models/order'
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher'
import { kafkaWrapper } from '../kafka-wrapper'

const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order
      .findById(req.params.orderId)
      .populate('ticket')

    if (order == null) throw new NotFoundError()

    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled
    await order.save()

    await new OrderCancelledPublisher(kafkaWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id
      }
    })

    res.status(204).send(order)
  })

export { router as deleteOrderRouter }
