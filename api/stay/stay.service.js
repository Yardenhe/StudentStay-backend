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
    save
}

// var stays = utilService.readJsonFile('./data/stay.json')
const collectionName = 'stay'

// working
async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria',criteria);
        
        const collection = await dbService.getCollection(collectionName)

        const stayCursor = await collection.find(criteria)
        // console.log('cursor:',stayCursor);

        const stays = stayCursor.toArray()
        console.log('stays:',stays); //PROMISE <pending> 

        return stays
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
// working
async function getById(stayId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const stay = collection.findOne({ _id: stayId })
        if (!stay) throw `Couldn't find stay with _id ${stayId}`
        return stay
    } catch (err) {
        loggerService.error(`while finding stay ${stayId}`, err)
        throw err
    }
}

async function remove(stayId, loggedinUser) {
    try {
        const idx = stays.findIndex(stay => stay._id === stayId)
        if (idx === -1) throw `Couldn't find stay with _id ${stayId}`

        const stay = stays[idx]
        // if (!loggedinUser.isAdmin && stay.owner._id !== loggedinUser._id) throw `Not your stay!`

        stays.splice(idx, 1)
        await _saveStaysToFile('./data/stay.json')
    } catch (err) {
        loggerService.error('stayService[remove] : ', err)
        throw err
    }
}

async function save(stayToSave, loggedinUser) {
    try {
        if (stayToSave._id) {
            const idx = stays.findIndex(stay => stay._id === stayToSave._id)
            if (idx === -1) throw `Couldn't find stay with _id ${stayToSave._id}`

            const stay = stays[idx]
            //if (!loggedinUser.isAdmin && stayToSave.owner._id !== loggedinUser._id) throw `Not your stay!`


            stays.splice(idx, 1, {...stay, ...stayToSave })
        } else {
            stayToSave._id = utilService.makeId()
            stayToSave.host = loggedinUser
            stays.push(stayToSave)
        }
        await _saveStaysToFile('./data/stay.json')
        return stayToSave
    } catch (err) {
        loggerService.error('stayService[save] : ' + err)
        throw err
    }
}

function _saveStaysToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(stays, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}

// working
function _buildCriteria(filterBy) {
    const criteria = {}
    
    if (filterBy.type) {
        // criteria.type = { $regex: filterBy.type, $options: 'i' }
        criteria.type = { $eq: filterBy.type}
    }

    if (filterBy.price) {
        criteria.price = { $lt: filterBy.price }
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