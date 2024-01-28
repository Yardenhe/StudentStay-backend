import express from 'express'
import { addStay, getStay, getStays, removeStay, updateStay, getStaysCount } from './stay.controller.js'
import { log } from '../../middlewares/logger.middleware.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()


router.get('/', log, getStays)
router.get('/count', getStaysCount)
router.get('/:stayId', getStay)
router.delete('/:stayId', removeStay)// log, requireAuth, removeStay)
router.post('/', requireAuth, addStay)
router.put('/', updateStay)//requireAuth, updateStay)

// add reviews / delete reviews



export const stayRoutes = router