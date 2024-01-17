import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js';
import { throws } from 'assert';
import { dbService } from '../../services/db.service.js';
import { ObjectId } from 'mongodb';


export const stayService = {
    query,
    getById,
    remove,
    add,
    update,
}

// var stays = utilService.readJsonFile('./data/stay.json')
const collectionName = 'stay'

// READ
async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria',criteria);
        
        const collection = await dbService.getCollection(collectionName)

        const stayCursor = await collection.find(criteria)
        // console.log('cursor:',stayCursor);

        const stays = await stayCursor.toArray()
        // console.log('stays:',stays);

        return stays
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
// GETBYID
async function getById(stayId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const stay = await collection.findOne({ _id: new ObjectId(stayId) })
        if (!stay) throw `Couldn't find stay with _id ${stayId}`
        return stay
    } catch (err) {
        loggerService.error(`while finding stay ${stayId}`, err)
        throw err
    }
}
// DELETE
async function remove(stayId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(stayId) })
        if (deletedCount===0){
            throw `couldn't Delete item with id ${stayId}`
        }
        // TODO: make loggedIn logic
        // if (!loggedinUser.isAdmin && stay.owner._id !== loggedinUser._id) throw `Not your stay!`
        return deletedCount
    } catch (err) {
        loggerService.error('stayService[remove] : ', err)
        throw err
    }
}
// CREATE
async function add(StayToSave, loggedinUser) {
    try {
        StayToSave.host = loggedinUser || 'dev user'
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(StayToSave)
        return StayToSave
    } catch (err) {
        loggerService.error('carService, can not add car : ' + err)
        throw err
    }
}
// UPDATE
async function update(stay,loggedinUser = '') {
    try {
        // Peek only updateable fields
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            type: stay.type,
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(stay._id) }, { $set: stayToSave })

        // console.log(stay);

        return `Updated Stay successfully`
    } catch (err) {
        loggerService.error(`cannot update stay ${stay._id}`, err)
        throw err
    }
}
// 
function _saveStaysToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(stays, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}


// 
function _buildCriteria(filterBy) {
   
    const criteria = {}
    
    if (filterBy.type) {
        criteria.type = { $regex: filterBy.type, $options: 'i' }
    }
   
    if (filterBy.minPrice) {
        
        criteria.price = {$gte: filterBy.minPrice, $lte: filterBy.maxPrice}
    }
    console.log('preCrateria',criteria );
    return criteria
}


// async function updateIdsToObjectId(collection) {
//     try {
//         const documents = await collection.find().toArray();

//         // Map documents to update operation promises
//         const updateOperations = documents.map((document) => {
//             const updatedId = new ObjectId(document._id);
//             return {
//                 updateOne: {
//                     filter: { _id: document._id },
//                     update: { $set: { _id: updatedId } },
//                 },
//             };
//         });

//         // Execute updateMany with all update operations
//         const result = await collection.bulkWrite(updateOperations);

//         console.log(`${result.modifiedCount} documents updated successfully.`);
//     } catch (err) {
//         console.error('Error updating _id values:', err);
//         throw err;
//     }
// }