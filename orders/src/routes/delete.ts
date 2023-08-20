import express, { type Request, type Response } from 'express'
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from '@gc-tickets/common'
import { Order } from '../models/order'

const router = express.Router()

router.delete('/api/orders/:orderId', requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.orderId)

    if (order == null) throw new NotFoundError()

    if (order.userId !== req.currentUser?.id) throw new NotAuthorizedError()

    order.status = OrderStatus.Cancelled
    await order.save()
    res.status(204).send(order)
  })

export { router as deleteOrderRouter }
