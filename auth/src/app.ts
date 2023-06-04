import express from 'express'
import 'express-async-errors' // permite manejar los errores de forma asyncrona

import { json } from 'body-parser'
import { currentUserRouter } from './routes/current-user'
import { signupRouter } from './routes/signup'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@gc-tickets/common'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test' // true: Solo funcionara las cookies por llamadas https
}))

app.use(currentUserRouter)
app.use(signupRouter)
app.use(signinRouter)
app.use(signoutRouter)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
