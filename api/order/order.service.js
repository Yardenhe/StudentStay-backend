import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js';
import { throws } from 'assert';
import { dbService } from '../../services/db.service.js';
import { ObjectId } from 'mongodb';


export const orderService = {
    query,
    getById,
    remove,
    add,
    update,
    count
}


const collectionName = 'order'

// READ
async function query(user) {
    try {
        const criteria = _buildCriteria(user)
        console.log('criteria', criteria);

        const collection = await dbService.getCollection(collectionName)

        const orderCursor = await collection.find(criteria)

        const orders = await orderCursor.toArray()


        return orders
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
async function count(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        console.log('criteria', criteria);

        const collection = await dbService.getCollection(collectionName)

        const orderCount = await collection.countDocuments(criteria)
        console.log('orderCount:', orderCount);


        return orderCount
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}
// GETBYID
async function getById(orderId) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const order = await collection.findOne({ _id: new ObjectId(orderId) })
        if (!order) throw `Couldn't find order with _id ${orderId}`
        return order
    } catch (err) {
        loggerService.error(`while finding order ${orderId}`, err)
        throw err
    }
}
// DELETE
async function remove(orderId, loggedinUser) {
    try {
        const collection = await dbService.getCollection(collectionName)
        const { deletedCount } = await collection.deleteOne({ _id: new ObjectId(orderId) })
        if (deletedCount === 0) {
            throw `couldn't Delete item with id ${orderId}`
        }
        // TODO: make loggedIn logic
        // if (!loggedinUser.isAdmin && order.owner._id !== loggedinUser._id) throw `Not your order!`
        return deletedCount
    } catch (err) {
        loggerService.error('orderService[remove] : ', err)
        throw err
    }
}
// CREATE
async function add(orderToSave, loggedinUser) {
    try {
        //orderToSave.hostId = loggedinUser._id || 'dev user'
        const collection = await dbService.getCollection(collectionName)
        await collection.insertOne(orderToSave)
        return orderToSave
    } catch (err) {
        loggerService.error('orderService, can not add order : ' + err)
        throw err
    }

}
// UPDATE
async function update(order, loggedinUser = '') {
    try {
        // Peek only updateable fields
        const orderToSave = {
            type: order.type,
            startDate: order.startDate,
            endDate: order.endDate,
            buyer: order.buyer,
            totalPrice: +order.totalPrice,
            guests: order.guests,
            stay: order.stay,
            msgs: order.msgs,
            status: order.status,
        }
        const collection = await dbService.getCollection(collectionName)
        await collection.updateOne({ _id: new ObjectId(order._id) }, { $set: orderToSave })
        const result = { ...orderToSave, _id: order._id }
        return result


    } catch (err) {
        loggerService.error(`cannot update order ${order._id}`, err)
        throw err
    }
}
// 
function _saveordersToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(orders, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}


// 
function _buildCriteria(user) {
    console.log('got orders criteria', user);
    const criteria = {}

    if (user.buyer) {
        // if (!isHost) {
        criteria['buyer._id'] = new ObjectId(user.buyer)
    } else if (user.hostId) {
        criteria.hostId = new ObjectId(user.hostId)
    }

    console.log('preCrateria', criteria);

    return criteria
}


