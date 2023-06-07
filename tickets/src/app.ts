import express from 'express'
import 'express-async-errors' // permite manejar los errores de forma asyncrona

import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { currentUser, errorHandler, NotFoundError } from '@gc-tickets/common'
import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test' // true: Solo funcionara las cookies por llamadas https
}))
app.use(currentUser) // busca extraer el usuario si se envia el token

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)
// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.all('*', async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler)

export { app }
