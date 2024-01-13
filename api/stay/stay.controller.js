// Stay CRUDL API
import { authService } from '../auth/auth.service.js';
import { stayService } from './stay.service.js';

// List
export async function getStays(req, res) {
    try {
        console.log('req.cookies', req.cookies)

        const filterBy = {
            txt: req.query.txt || '',
            minSpeed: +req.query.minSpeed || 0,
            pageIdx: req.query.pageIdx || undefined
        }
        const stays = await stayService.query(filterBy)
        res.send(stays)
    } catch (err) {
        res.status(400).send(`Couldn't get stays`)
    }
}

// Get
export async function getStay(req, res) {
    const { stayId } = req.params
    const lastStayId = req.cookies.lastStayId
    try {
        if (lastStayId === stayId) return res.status(400).send('Dont over do it')
        const stay = await stayService.getById(stayId)
        res.cookie('lastStayId', stayId, { maxAge: 5 * 1000 })
        res.send(stay)
    } catch (err) {
        res.status(400).send(`Couldn't get stay`)
    }
}


// // Delete
export async function removeStay(req, res) {
    const { stayId } = req.params
    try {
        await stayService.remove(stayId, req.loggedinUser)
        res.send('Deleted OK')
    } catch (err) {
        res.status(400).send(`Couldn't remove stay : ${err}`)
    }
}


// // Save
export async function addStay(req, res) {
    const { vendor, speed } = req.body

    // Better use createStay()
    const stayToSave = { vendor, speed: +speed }
    if (!vendor)

        try {
        const savedStay = await stayService.save(stayToSave, req.loggedinUser)
        res.send(savedStay)
    } catch (err) {
        res.status(400).send(`Couldn't save stay`)
    }
}

export async function updateStay(req, res) {

    const { _id, vendor, speed } = req.body
    const stayToSave = { _id, vendor, speed: +speed }

    try {
        const savedStay = await stayService.save(stayToSave, req.loggedinUser)
        res.send(savedStay)
    } catch (err) {
        res.status(400).send(`Couldn't save stay`)
    }
}