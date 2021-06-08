import { decode } from 'jsonwebtoken'
import ApiError from '../error/ApiError.js'

export default (role) => {
  return (req, res, next) => {
    if (req.method === 'OPTIONS') {
      return next()
    }
    try {
      const token = req.header.authorization.split('')[1]
      if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
      }
      const decoded = jwt.verify(token, process.env.SERCRET_KEY)
      if (decode.role !== role) {
        return next(ApiError.forbidden('You have no access'))
      }
      req.user = decoded
      next()
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized' })
    }
  }
}
