import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../app'
import jwt from 'jsonwebtoken'

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
  // Build a JWT Payload. { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'pepe@gmail.com'
  }
  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!)

  // Build Session Object
  const session = { jwt: token }

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session)

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64')

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`]
}
