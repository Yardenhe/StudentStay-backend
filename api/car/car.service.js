import fs from 'fs'

import { loggerService } from '../../services/logger.service.js'
import { utilService } from './../../services/util.service.js';
import { throws } from 'assert';

export const carService = {
    query,
    getById,
    remove,
    save
}

var cars = utilService.readJsonFile('./data/car.json')
const PAGE_SIZE = 4




async function query(filterBy = {}) {
    try {
        let carsToReturn = [...cars]
        if (filterBy.txt) {
            const regExp = new RegExp(filterBy.txt, 'i')
            carsToReturn = carsToReturn.filter(car => regExp.test(car.vendor))
        }

        if (filterBy.minSpeed) {
            carsToReturn = carsToReturn.filter(car => car.speed >= filterBy.minSpeed)
        }

        if (filterBy.pageIdx !== undefined) {
            const startIdx = filterBy.pageIdx * PAGE_SIZE
            carsToReturn = carsToReturn.slice(startIdx, startIdx + PAGE_SIZE)
        }

        return carsToReturn
    } catch (err) {
        loggerService.error(err)
        throw err
    }
}

async function getById(carId) {
    try {
        var car = cars.find(car => car._id === carId)
        if (!car) throw `Couldn't find car with _id ${carId}`
        return car
    } catch (err) {
        loggerService.error('carService[getById] : ' + err)
        throw (err)
    }
}

async function remove(carId, loggedinUser) {
    try {
        const idx = cars.findIndex(car => car._id === carId)
        if (idx === -1) throw `Couldn't find car with _id ${carId}`

        const car = cars[idx]
        if (!loggedinUser.isAdmin && car.owner._id !== loggedinUser._id) throw `Not your car!`

        cars.splice(idx, 1)
        await _saveCarsToFile('./data/car.json')
    } catch (err) {
        loggerService.error('carService[remove] : ', err)
        throw err
    }
}

async function save(carToSave, loggedinUser) {
    try {
        if (carToSave._id) {
            const idx = cars.findIndex(car => car._id === carToSave._id)
            if (idx === -1) throw `Couldn't find car with _id ${carToSave._id}`

            const car = cars[idx]
            if (!loggedinUser.isAdmin && carToSave.owner._id !== loggedinUser._id) throw `Not your car!`

            cars.splice(idx, 1, {...car, ...carToSave })
        } else {
            carToSave._id = utilService.makeId()
            carToSave.createdAt = Date.now()
            carToSave.owner = loggedinUser
            cars.push(carToSave)
        }
        await _saveCarsToFile('./data/car.json')
        return carToSave
    } catch (err) {
        loggerService.error('carService[save] : ' + err)
        throw err
    }
}

function _saveCarsToFile(path) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(cars, null, 2)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}