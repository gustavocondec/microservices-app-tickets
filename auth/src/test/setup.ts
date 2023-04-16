import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'

declare global{
  var signin: () => Promise<string[]>
}

let mongo: MongoMemoryServer | null
beforeAll(async () => {
  process.env.JWT_KEY = 'ASDASDAS'

  mongo = await MongoMemoryServer.create()
  const mongoUri = mongo.getUri()

  await mongoose.connect(mongoUri)
})

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections()

  for (const collection of collections) { await collection.deleteMany({}) }
})

afterAll(async () => {
  if (mongo != null) {
    await mongo.stop()
  }
  await mongoose.connection.close()
})

// Funcion Global para logearse

global.signin = async (): Promise<string[]> => {
  const email = 'test@test.com'
  const password = 'pasword'

  const response = await request(app)
    .post('/api/users/signup')
    .send({ email, password })
    .expect(201)

  return response.get('Set-Cookie')
}
