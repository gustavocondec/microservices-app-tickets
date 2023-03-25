import express, { type Request, type Response } from 'express'
import { body, validationResult } from 'express-validator'
import { RequestValidationError } from '../errors/request-validation-error'
import { User } from '../models/user'
import { BadRequestError } from '../errors/bad-request-error'

const router = express.Router()

router.post('/api/users/signup', [
  body('email').isEmail().withMessage('Email must be valid.'),
  body('password').isString().trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characteres')
// eslint-disable-next-line @typescript-eslint/no-misused-promises
], async (req: Request, res: Response) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array())
  }

  const existingUser = await User.findOne({ email: req.body.email })
  if (existingUser != null) throw new BadRequestError('Email in use.')

  const newUser = User.build({ email: req.body.email, password: req.body.password })

  await newUser.save()

  return res.status(201).send(newUser)
})

export { router as signupRouter }
