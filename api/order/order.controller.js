// Order CRUDL API
import { ObjectId } from 'mongodb';
import { authService } from '../auth/auth.service.js';
import { orderService } from './order.service.js';
import { socketService } from '../../services/socket.service.js';

// List
export async function getOrders(req, res) {
    try {
        // console.log('getOrders req.cookies', req.cookies)

        // console.log("🚀 ~ getOrders ~ buyer:", req.query)

        const buyer = req.query || null
        const hostId = req.query || null

        // console.log("🚀 ~ getOrders ~ hostId:", hostId)
        const userTypeId = (buyer ? buyer : hostId) || {}
        const orders = await orderService.query(userTypeId)

        res.send(orders)
    } catch (err) {
        res.status(400).send(`Couldn't get orders`)
    }
}


// Get
export async function getOrder(req, res) {
    const { orderId } = req.params
    // const lastOrderId = req.cookies.lastOrderId
    try {
        // if (lastOrderId === orderId) return res.status(400).send('Dont over do it')
        const order = await orderService.getById(orderId)
        res.cookie('lastorderId', orderId, { maxAge: 5 * 1000 })
        res.send(order)
    } catch (err) {
        res.status(400).send(`Couldn't get order`)
    }
}


// Delete
export async function removeOrder(req, res) {
    const { orderId } = req.params
    try {
        const deletedCount = await orderService.remove(orderId, req.loggedinUser)
        res.send(`Deleted ${deletedCount} items`)
    } catch (err) {
        res.status(400).send(`Couldn't remove order : ${err}`)
    }
}


// ADD

export async function addOrder(req, res) {
    const {
        startDate,
        endDate,
        // buyer ,
        hostId,
        guests,
        totalPrice,
        stay,
        msgs,
        // status,
    } = req.body
    console.log("🚀 ~ addOrder ~ req.loggedinUser:", req.loggedinUser)

    const { _id, fullname } = req.loggedinUser
    // Better use createOrder()
    const orderToSave = {
        startDate,
        endDate,
        buyer: { _id: new ObjectId(_id), fullname },
        hostId,
        totalPrice,
        guests,
        stay,
        msgs,
        status: "pending",
    }

    console.log(orderToSave);

    // if (!host){
    try {
        const savedOrder = await orderService.add(orderToSave, req.loggedinUser)
        res.send(savedOrder)
    } catch (err) {
        res.status(400).send(`Couldn't save order`)
    }
    // }
}

// UPDATE
export async function updateOrder(req, res) {
    console.log(req.body);

    const {
        _id,
        startDate,
        endDate,
        buyer,
        hostId,
        totalPrice,
        guests,
        stay,
        msgs,
        status, } = req.body
    const orderToSave = {
        _id,
        startDate,
        endDate,
        buyer: { _id: new ObjectId(buyer._id), fullname: buyer.fullname },
        hostId,
        totalPrice,
        guests,
        stay,
        msgs,
        status,
    }
    // console.log(orderToSave);
    try {
        const savedOrder = await orderService.update(orderToSave, req.loggedinUser)
        socketService.emitToUser({ type: 'order-updated', data: savedOrder, userId: orderToSave.buyer._id })
        console.log("🚀 ~ updateOrder ~ savedOrder:", savedOrder)
        res.send(savedOrder)
    } catch (err) {
        res.status(400).send(`Couldn't save order`)
    }
}


