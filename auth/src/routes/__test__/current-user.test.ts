import request from 'supertest'
import { app } from '../../app'

it('responds with detail about the currentUser', async () => {
  const responseSignup = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)

  const response = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', responseSignup.get('Set-Cookie'))
    .send()
    .expect(200)
  expect(response.body.currentUser.email).toEqual('test@test.com')
})
