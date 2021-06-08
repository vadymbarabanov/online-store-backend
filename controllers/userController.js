import ApiError from '../error/ApiError.js'
import * as argon2 from 'argon2'
import { User, Basket } from '../models/models.js'
import jwt from 'jsonwebtoken'

const generateJwt = (id, email, role) => {
  return jwt.sign({ userId: id, email, role }, process.env.SECRET_KEY, {
    expiresIn: '24h',
  })
}

class UserController {
  async register(req, res, next) {
    const { email, password, role } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Invalid email or password'))
    }

    const candidate = await User.findOne({ where: { email } })

    if (candidate) {
      return next(ApiError.badRequest('User with this email already exist'))
    }

    const hashedPassword = await argon2.hash(password)

    const user = await User.create({ email, password: hashedPassword })
    const basket = await Basket.create({ userId: user.id })
    const token = generateJwt(user.id, user.email, user.role)

    return res.json({ token })
  }

  async login(req, res, next) {
    const { email, password } = req.body
    if (!email || !password) {
      return next(ApiError.badRequest('Invalid email or password'))
    }

    const user = await User.findOne({ where: { email } })
    if (!user) {
      return next(ApiError.internal('No user found'))
    }

    const isVerified = await argon2.verify(user.password, password)
    if (!isVerified) {
      return next(ApiError.badRequest('Invalid email or password'))
    }
    const token = generateJwt(user.id, user.email, user.role)

    return res.json({ token })
  }

  async check({ user }, res, next) {
    const { id, email, role } = user
    const token = generateJwt(id, email, role)
    return res.json({ token })
  }
}

export default new UserController()
