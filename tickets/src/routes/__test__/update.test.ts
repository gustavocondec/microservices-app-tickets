import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { kafkaWrapper } from '../../kafka-wrapper'
import { Subjects } from '@gc-tickets/common'

it('returns 404 if the provided of does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', await global.signin())
    .send({
      title: 'aasas',
      price: 20
    })
    .expect(404)
})

it('returns 404 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'aasas',
      price: 20
    })
    .expect(401)
})

it('returns 401 if the user does not own the ticket', async () => {
  // primero crear ticket, el global. signin crea un nuevo usuario
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      title: 'sasas',
      price: 20
    })

  // El logeo genera un nevo usuario diferente al anterior al crear ticket
  await request(app)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', await global.signin())
    .send({
      title: 'dasdasdasf',
      price: 1000
    })
    .expect(401)
})

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = await global.signin()
  // primero crear ticket, el global. signin crea un nuevo usuario
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sasas',
      price: 20
    })

  await request(app)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20
    })
    .expect(400)

  await request(app)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'saad',
      price: -20
    })
    .expect(400)
})

it('update the ticket provided valid inputs', async () => {
  const cookie = await global.signin()
  // primero crear ticket, el global. signin crea un nuevo usuario
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sasas',
      price: 20
    })

  const data = {
    title: 'new title',
    price: 100
  }
  await request(app)
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(data)
    .expect(200)

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const ticketReponse = await request(app).get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketReponse.body.title).toEqual(data.title)
  expect(ticketReponse.body.price).toEqual(data.price)
})

it('publishes an event', async () => {
  const cookie = await global.signin()
  // primero crear ticket, el global. signin crea un nuevo usuario
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'sasas',
      price: 20
    })

  const data = {
    title: 'new title',
    price: 100
  }
  await request(app)
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send(data)
    .expect(200)

  // 2 por: 1 crear, 1 actualizar
  expect(kafkaWrapper.client.producer().send).toHaveBeenCalledTimes(2) // debe reestablecerse las llamadas
  expect(kafkaWrapper.client.producer().send).toHaveBeenLastCalledWith({ topic: Subjects.TicketUpdated, messages: expect.anything() })
})
