import { Router } from 'express'
import brandContoller from '../controllers/brandController.js'
import checkRoleMiddleware from '../middleware/checkRoleMiddleware.js'

const router = new Router()

router.post('/', checkRoleMiddleware('ADMIN'), brandContoller.create)
router.get('/', brandContoller.getAll)

export default router
