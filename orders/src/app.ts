import express from 'express'
import 'express-async-errors' // permite manejar los errores de forma asyncrona

import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from '@gc-tickets/common'
import { deleteOrderRouter } from './routes/delete'
import { indexOrderRouter } from './routes'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test' // true: Solo funcionara las cookies por llamadas https
}))
app.use(currentUser) // busca extraer el usuario si se envia el token

app.use(deleteOrderRouter)
app.use(indexOrderRouter)
app.use(newOrderRouter)
app.use(showOrderRouter)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
