import express, { type Request, type Response } from 'express'
import { NotAuthorizedError, NotFoundError, requireAuth } from '@gc-tickets/common'
import { Order } from '../models/order'

const router = express.Router()

router.get('/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response): Promise<void> => {
    const order = await Order.findById(req.params.orderId).populate('ticket')
    if (order == null) throw new NotFoundError()
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()

    res.send(order)
  })

export { router as showOrderRouter }
