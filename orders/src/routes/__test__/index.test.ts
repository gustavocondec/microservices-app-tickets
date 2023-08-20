import { Ticket } from '../../models/ticket'
import request from 'supertest'
import { app } from '../../app'

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 20
  })
  await ticket.save()
  return ticket
}

it('fetches orders for an particular user', async () => {
  // create three tickets
  const ticketOne = await buildTicket()
  const ticketTwo = await buildTicket()
  const ticketThree = await buildTicket()

  const userOne = await global.signin()
  const userTwo = await global.signin()

  // crate one order as user one
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201)

  // create two orders as user two
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201)

  // make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200)
  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderOne.id)
  expect(response.body[1].id).toEqual(orderTwo.id)
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id)
  expect(response.body[1].ticket.id).toEqual(ticketThree.id)
})
