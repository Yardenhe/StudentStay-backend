import express from 'express'
import { addStay, getStay, getStays, removeStay, updateStay } from './stay.controller.js'
import { log } from '../../middlewares/logger.middleware.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()


router.get('/', log, getStays)
router.get('/:stayId', getStay)
router.delete('/:stayId', log, requireAuth, removeStay)
router.post('/', requireAuth, addStay)
router.put('/', requireAuth, updateStay)



export const stayRoutes = router