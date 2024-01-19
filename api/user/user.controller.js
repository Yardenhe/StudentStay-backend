import { userService } from './user.service.js'
import { loggerService } from '../../services/logger.service.js'

export async function getUser(req, res) {
    const {userId} = req.params
    try {
        const user = await userService.getById(userId)
        res.send(user)
    } catch (err) {
        loggerService.error('Failed to get user', err)
        res.status(400).send({ err: 'Failed to get user' })
    }
}

export async function getUsers(req, res) {
    try {
        const filterBy = {
            txt: req.query.txt || '',
            minBalance: +req.query.minBalance || 0
        }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        loggerService.error('Failed to get users', err)
        res.status(400).send({ err: 'Failed to get users' })
    }
}

export async function addUser(req, res) {
    const {username,fullname,password} = req.body

    const userToSave = {username,fullname,password}

    try {
        const savedUser = await userService.add(userToSave)
        res.send(savedUser)
    } catch (err) {
        res.status(400).send(`Couldn't save User`)
        
    }
}

export async function deleteUser(req, res) {
    const {userId} = req.params
    try {
        await userService.remove(userId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        loggerService.error('Failed to delete user', err)
        res.status(400).send({ err: 'Failed to delete user' })
    }
}

export async function updateUser(req, res) {
    try {
        const {_id,username,fullname,password} = req.body
        const userToSave = {_id,username,fullname,password}

        const savedUser = await userService.update(userToSave)
        res.send(savedUser)
    } catch (err) {
        loggerService.error('Failed to update user', err)
        res.status(400).send({ err: 'Failed to update user' })
    }
}