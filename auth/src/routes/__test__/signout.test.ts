import request from 'supertest'
import { app } from '../../app'

it('clears the cookie after signout', async () => {
  // creamos usuario y devuelve token
  const signupResp = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201)
  // resultado con el token recibido desde el server
  // console.log('response cookie signup', signupResp.get('Set-Cookie'))

  // Logout token
  const responseSignout = await request(app)
    .get('/api/users/signout')
    .send({})
    .expect(200)

  // Resultado del cookie vacio
  expect(responseSignout.get('Set-Cookie')[0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly')
})
