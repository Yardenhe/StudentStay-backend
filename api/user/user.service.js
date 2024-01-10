import fs from 'fs'
import { utilService } from '../../services/util.service.js'


const users = utilService.readJsonFile('data/user.json')

export const userService = {
    query,
    getById,
    remove,
    save,
    getByUsername
}



async function query() {
    return users
}

async function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (!user) throw 'User not found!'
    return user
}

async function getByUsername(username) {
    return users.find(user => user.username === username)
}

async function remove(userId) {
    users = users.filter(user => user._id !== userId)
    return await _saveUsersToFile()
}

async function save(user) {
    user._id = utilService.makeId()
    user.score = 10000
    if (!user.imgUrl) user.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
        // TODO: severe security issue- attacker can post admins
    users.push(user)
    await _saveUsersToFile()
    return user
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {

        const usersStr = JSON.stringify(users, null, 2)
        fs.writeFile('data/user.json', usersStr, (err) => {
            if (err) {
                return console.log(err);
            }
            resolve()
        })
    })
}