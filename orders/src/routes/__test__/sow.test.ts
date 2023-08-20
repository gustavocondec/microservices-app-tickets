import { Ticket } from '../../models/ticket'
import request from 'supertest'
import { app } from '../../app'

it('returns an error if one user tries to fetch another users order', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()

  const user = await global.signin()
  // make a request to build an order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send(({ ticketId: ticket.id }))
    .expect(201)

  // maike requet to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', await global.signin())
    .send()
    .expect(401)
})
