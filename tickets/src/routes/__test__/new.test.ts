import request from 'supertest'
import { app } from '../../app'
import { Ticket } from '../../models/ticket'

it('has a route handler listening to /api/tickets for post request', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .send({})

  expect(response.status).not.toEqual(404)
})

it('can only be accessed if the user is signed in', async () => {
  await request(app)
    .post('/api/tickets')
    .send({})
    .expect(401)
})

it('returns a status other 401 if user is signed in', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({})
  expect(response.status).not.toEqual(401)
})

it('returns an error if an invalid title is provider', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      title: '',
      price: 10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      price: 10
    })
    .expect(400)
})

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      title: 'asfadfsas',
      price: -10
    })
    .expect(400)

  await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      title: 'dasdasdas'
    })
    .expect(400)
})

it('creates a ticket with valid inputs', async () => {
  // TODO: add in a check to make sure a ticket was saved
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0)

  const toSave = {
    title: 'asasas',
    price: 20
  }

  await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send(toSave)
    .expect(201)

  tickets = await Ticket.find({})

  expect(tickets.length).toEqual(1)
  expect(tickets[0].price).toEqual(toSave.price)
  expect(tickets[0].title).toEqual(toSave.title)
})
