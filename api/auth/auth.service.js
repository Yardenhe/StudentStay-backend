import Cryptr from 'cryptr'
import bcrypt from 'bcrypt'

import { userService } from '../user/user.service.js'
import { loggerService } from '../../services/logger.service.js'

const cryptr = new Cryptr(process.env.SECRET1 || 'Secret-Puk-1234')

export const authService = {
    getLoginToken,
    validateToken,
    login,
    signup
}


function getLoginToken(user) {
    const str = JSON.stringify(user)
    const encryptedStr = cryptr.encrypt(str)
    return encryptedStr
}

function validateToken(token) {
    try {
        const json = cryptr.decrypt(token)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
    }
    return null
}

async function login(email, password) {
    var user = await userService.getByEmail(email)
    if (!user) throw 'Unkown email'

    //  un-comment for real login
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw 'Invalid email or password'

    // Removing passwords and personal data
    const miniUser = {
        _id: user._id,
        fullname: user.fullname,
        pictureUrl: user.pictureUrl,
        // Additional fields required for miniuser
    }
    return miniUser

}

async function signup({ email, password, fullname }) {
    const saltRounds = 10

    loggerService.debug(`auth.service - signup with email: ${email}, fullname: ${fullname}`)
    if (!email || !password || !fullname) throw 'Missing required signup information'

    const userExist = await userService.getByEmail(email)
    if (userExist) throw 'Username already taken'

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.save({ email, password: hash, fullname })
}