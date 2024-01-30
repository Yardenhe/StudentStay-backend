import configProd from './prod.js'
import configDev from './dev.js'


export var config

// for dev - this code doesnt reach
if (process.env.NODE_ENV === 'production') {
    config = configProd
} else {
    config = configDev
}
//config.isGuestMode = true