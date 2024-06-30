import configProd from './prod.js'
import configDev from './dev.js'


export var config

// use flase for dev - this code doesnt reach
if (process.env.NODE_ENV === 'production' && false) {
    config = configProd
} else {
    config = configDev
}
//config.isGuestMode = true