import { Ticket } from '../../models/ticket'
import request from 'supertest'
import { app } from '../../app'
import { Order } from '../../models/order'
import { OrderStatus } from '@gc-tickets/common'

it('marks an order as canceller', async () => {
  // create a ticket with Ticket Model
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()

  const user = await global.signin()
  // make request to create an order
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  // make a request to cancel the order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(204)

  // expectation to make sure the thing is cancelled
  const updateOrder = await Order.findById(order.id)

  expect(updateOrder!.status).toEqual(OrderStatus.Cancelled)
})

it.todo('emits a order canceled event')
