import jwt from 'jsonwebtoken'

export default (req, res, next) => {
  if (req.method === 'OPTIONS') {
    return next()
  }
  try {
    const token = req.header.authorization.split('')[1]
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const decoded = jwt.verify(token, process.env.SERCRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' })
  }
}
