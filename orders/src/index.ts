import mongoose from 'mongoose'
import { app } from './app'
import { kafkaWrapper } from './kafka-wrapper'

const start = async (): Promise<void> => {
  if (process.env?.JWT_KEY == null) throw new Error('JWT_KEY must be defined')
  if (process.env?.MONGO_URI == null) throw new Error('MONGO_URI must be defined')
  if (process.env?.KAFKA_URL == null) throw new Error('KAFKA_URL must be defined')
  if (process.env?.KAFKA_CLIENT_ID == null) throw new Error('KAFKA_CLIENT_ID must be defined')

  try {
    await kafkaWrapper.connect(process.env.KAFKA_URL)
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to mongodb')
  } catch (e) {
    console.error(e)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!')
  })
}
void start()
