import express from 'express'
import cors from 'cors'
import path from 'path'
import cookieParser from 'cookie-parser'
import http from 'http'


const app = express()
const server = http.createServer(app)

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
import { orderRoutes } from './api/order/order.routes.js'
import { setupSocketAPI } from './services/socket.service.js'


app.use('/api/stay', stayRoutes)
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/order', orderRoutes)

setupSocketAPI(server)

// fallback route
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

import { loggerService } from './services/logger.service.js'

const PORT = process.env.PORT || 3030
server.listen(PORT, () => {
    loggerService.info('Up and running on port ' + PORT)
})