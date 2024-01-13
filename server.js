import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'


const app = express()

const corsOptions = {
    origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    credentials: true
}

// App configuration
app.use(cors(corsOptions))
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())


// Routes
import { stayRoutes } from './api/stay/stay.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { authRoutes } from './api/auth/auth.routes.js'

app.use('/api/stay', stayRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)

// Some example routes

app.get('/', (req, res) => {
    res.send(`<h1>Hi Express</h1>`)
})

app.get('/puki', (req, res) => {
    let stayCount = +req.cookies.stayCount
    console.log(stayCount);
    res.cookie('stayCount', stayCount + 1 || 1)
    res.send(`<h1>Hi Puki</h1>`)
})

app.get('/nono', (req, res) => {
    res.redirect('/puki')
})

// fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { loggerService } from './services/logger.service.js'

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
    loggerService.info('Up and running on port ' + PORT)
})