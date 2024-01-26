import express from 'express'
import { addOrder, getOrder, getOrders, removeOrder, updateOrder } from './order.controller.js'
import { log } from '../../middlewares/logger.middleware.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()


router.get('/', log, getOrders)
router.get('/:orderId', getOrder)
router.delete('/:orderId', removeOrder)// log, requireAuth, removeOrder)
router.post('/', requireAuth, addOrder)
router.put('/', requireAuth, updateOrder)

// add reviews / delete reviews



export const orderRoutes = router