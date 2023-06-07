import request from 'supertest'
import { app } from '../../app'
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createTicket = async () => {
  return await request(app)
    .post('/api/tickets')
    .set('Cookie', await global.signin())
    .send({
      title: 'asas',
      price: 20
    })
}
it('can fetch a list of tickets', async () => {
  await createTicket()
  await createTicket()
  await createTicket()

  const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

  // eslint-disable-next-line eqeqeq
  expect(response.body.length == 3)
})
