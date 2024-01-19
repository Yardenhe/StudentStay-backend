import express from 'express'
import { getUser, getUsers, deleteUser, updateUser, addUser } from './user.controller.js'
import { requireAdmin } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getUsers)
router.post('/',addUser)
router.put('/', updateUser)//requireAdmin, updateUser)
router.get('/:userId', getUser)//requireAdmin, getUser)
router.delete('/:userId', deleteUser)//requireAdmin, deleteUser)

export const userRoutes = router