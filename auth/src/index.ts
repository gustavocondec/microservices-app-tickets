import express from 'express'
import 'express-async-errors' // permite manejar los errores de forma asyncrona

import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { errorHandler } from './middlewares/error-handler'
import { NotFoundError } from './errors/not-found-error'
import mongoose from 'mongoose'

const app = express()

app.use(json())

app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

const start = async (): Promise<void> => {
  try {
  // await mongoose.connect('mongodb://localhost:27017') //si mongo esta instalado en nuestra local o en cloud
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth')
    console.log('connected to mongodb')
  } catch (e) {
    console.error(e)
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!')
  })
}

void start()
