import mongoose from 'mongoose'
import { app } from './app'

const start = async (): Promise<void> => {
  if (process.env?.JWT_KEY == null) throw new Error('JWT_KEY must be defined')
  if (process.env?.MONGO_URI == null) throw new Error('MONGO_URI must be defined')

  try {
  // await mongoose.connect('mongodb://localhost:27017') //si mongo esta instalado en nuestra local o en cloud
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
