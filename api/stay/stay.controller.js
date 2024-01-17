// Stay CRUDL API
import { authService } from '../auth/auth.service.js';
import { stayService } from './stay.service.js';

// List
export async function getStays(req, res) {
    try {
        console.log('getStays req.cookies', req.cookies)
        console.log('getStays req.query',req.query);
        const filterBy = {
            minPrice: +req.query.minPrice || null,
            maxPrice: +req.query.maxPrice || null,
            type: req.query.type || '',
        }

        console.log('getStays filterBy', filterBy)
        const stays = await stayService.query(filterBy)
        // console.log(stays[0]);
        
        res.send(stays)
    } catch (err) {
        res.status(400).send(`Couldn't get stays`)
    }
}

// Get
export async function getStay(req, res) {
    const { stayId } = req.params
    // const lastStayId = req.cookies.lastStayId
    try {
        // if (lastStayId === stayId) return res.status(400).send('Dont over do it')
        const stay = await stayService.getById(stayId)
        res.cookie('lastStayId', stayId, { maxAge: 5 * 1000 })
        res.send(stay)
    } catch (err) {
        res.status(400).send(`Couldn't get stay`)
    }
}


// Delete
export async function removeStay(req, res) {
    const { stayId } = req.params
    try {
        const deletedCount = await stayService.remove(stayId, req.loggedinUser)
        res.send(`Deleted ${deletedCount} items`)
    } catch (err) {
        res.status(400).send(`Couldn't remove stay : ${err}`)
    }
}


// ADD
export async function addStay(req, res) {
    console.log('trying to add stay');
    const {
        name,
        type,
        imgUrls,
        price,
        summary,
        capacity,
        amenities,
        bathrooms,
        bedrooms,
        roomType,
        loc,
        beds,
        propertyType,
        labels} = req.body

    // Better use createStay()
    const stayToSave = { 
        name,
        price,
        type,
        imgUrls,
        summary,
        capacity,
        amenities,
        bathrooms,
        bedrooms,
        roomType,
        loc,
        beds,
        propertyType,
        labels 
    }

        console.log(stayToSave);

    // if (!host){
        try {
            const savedStay = await stayService.add(stayToSave, req.loggedinUser)
            res.send(savedStay)
        } catch (err) {
            res.status(400).send(`Couldn't save stay`)
        }
    // }
}

// UPDATE
export async function updateStay(req, res) {
    console.log(req.body);

    const {
         _id,
        name,
        type,
        imgUrls,
        price,
        summary,
        capacity,
        amenities,
        bathrooms,
        bedrooms,
        roomType,
        host,
        loc,
        beds,
        propertyType,
        labels } = req.body
    const stayToSave = {
        _id,
        name,
        type,
        imgUrls,
        price:+price,
        summary,
        capacity,
        amenities,
        bathrooms:+bathrooms,
        bedrooms:+bedrooms,
        roomType,
        host,
        loc,
        beds:+beds,
        propertyType,
        labels }
        // console.log(stayToSave);
    try {
        const savedStay = await stayService.update(stayToSave, req.loggedinUser)
        res.send(savedStay)
    } catch (err) {
        res.status(400).send(`Couldn't save stay`)
    }
}


