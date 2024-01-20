import { dbService } from '../../services/db.service.js'
import { loggerService } from '../../services/logger.service.js'
// import { reviewService } from '../review/review.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

const collectionName = 'user'

export const userService = {
    query,
    getById,
    // getByUsername,
    getByEmail,
    remove,
    update,
    save
}


async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    try {
        const collection = await dbService.getCollection(collectionName)
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            // user.createdAt = new ObjectId(user._id).getTimestamp()
            return user
        })
        return users
    } catch (err) {
        loggerService.error('cannot find users', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password

        // if (user.stays) {
        //     user.givenReviews = await reviewService.query({ byUserId: new ObjectId(user._id) })
        // }
        // user.givenReviews = user.givenReviews.map(review => {
        //     delete review.byUser
        //     return review
        // })

        return user
    } catch (err) {
        loggerService.error(`while finding user by id: ${userId}`, err)
        throw err
    }
}

async function save(userToSave) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(userToSave)
        // userToReturn = delete userToSave.password
        return userToSave
    } catch (err) {
        loggerService.error('userServicve, Couldnt add User : ' + err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        await collection.deleteOne({ _id: new ObjectId(userId) })
    } catch (err) {
        loggerService.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(userToSave) {
    // const {_id} = userToSave
    // delete userToSave._id
    const userFieldsToUpdate = _includeFieldsToUpdate(userToSave)
    try {

        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(userToSave._id) }, { $set: userFieldsToUpdate })
        return userToSave
    } catch (err) {
        loggerService.error(`cannot update user ${userToSave._id}`, err)
        throw err
    }
}


async function getByEmail(email) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const user = await collection.findOne({ email })
        return user
    } catch (err) {
        loggerService.error(`while finding user by username: ${email}`, err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.username) {
        criteria.username = { $regex: filterBy.username, $options: 'i' }
    }
    return criteria
}

function _includeFieldsToUpdate(user){
    const userFieldsToUpdate = {}
    if (user.fullname){
        userFieldsToUpdate.fullname = user.fullname
    }
    if (user.username){
        userFieldsToUpdate.username = user.username
    }

    return userFieldsToUpdate
}

// GENERIC FUNCTION
// function _includeFieldsToUpdate(dataObject) {
//     // MUST NOT INCLUDE _id
//     const fieldsToUpdate = {}
//     Object.keys(dataObject).forEach((field) => {
//         if (dataObject[field]) {
//             fieldsToUpdate[field] = dataObject[field]
//         }
//     })
//     console.log("🚀 ~ _includeFieldsToUpdate ~ fieldsToUpdate:", fieldsToUpdate)

//     return fieldsToUpdate
// }