import express, { type Request, type Response } from 'express'
import { body } from 'express-validator'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { BadRequestError, validateRequest } from '@gc-tickets/common'

const router = express.Router()

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password').isString().trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characteres')
// eslint-disable-next-line @typescript-eslint/no-misused-promises
], validateRequest, async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body.email })
  if (existingUser != null) throw new BadRequestError('Email in use.')

  const newUser = User.build({ email: req.body.email, password: req.body.password })

  await newUser.save()

  // Generate JWT
  const userJwt = jwt.sign({
    id: newUser.id,
    email: newUser.email
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  }, process.env.JWT_KEY!)

  // Store it on session object
  req.session = {
    jwt: userJwt
  }

  return res.status(201).send(newUser)
})

export { router as signupRouter }
