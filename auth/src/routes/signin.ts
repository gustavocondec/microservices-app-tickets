import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'
import { User } from '../models/user'
import { Password } from '../services/password'
import jwt from 'jsonwebtoken'
import { BadRequestError, validateRequest } from '@gc-tickets/common'

const router = express.Router()

router.post('/api/users/signin', [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
// eslint-disable-next-line @typescript-eslint/no-misused-promises
], validateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser == null) throw new BadRequestError('Invalid credentials')

  const passwordsMatch = await Password.compare(existingUser.password, password)
  if (!passwordsMatch) throw new BadRequestError('Invalid Credentials')

  // Generate JWT
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_KEY!)

  // Store it on session object
  req.session = {
    jwt: userJwt
  }
  return res.status(201).send(existingUser)
})

export { router as signinRouter }
