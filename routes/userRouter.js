import { Router } from 'express'
import UserController from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = new Router()

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware, UserController.check)

export default router
