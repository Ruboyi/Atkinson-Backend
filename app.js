'use strict'

require('dotenv').config()
const cors = require('cors')
const express = require('express')
const app = express()
const http = require('http')
const fileUpload = require('express-fileupload')
const configureWebSocket = require('./app/websocket/websocket')

const { PORT } = process.env

app.use(fileUpload())
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

const usersRouter = require('./app/routes/users-routes')
const barbersRouter = require('./app/routes/barbers-routes')
const servicesRouter = require('./app/routes/services-routes')
const appointmentsRouter = require('./app/routes/appointments-routes')
const notificationsRouter = require('./app/routes/notifications-routes')
const holidaysRouter = require('./app/routes/holidays-routes')

const logger = require('./app/logs/logger')

app.use('/api/v1/users/', usersRouter)
app.use('/api/v1/barbers/', barbersRouter)
app.use('/api/v1/services/', servicesRouter)
app.use('/api/v1/appointments/', appointmentsRouter)
app.use('/api/v1/notifications/', notificationsRouter)
app.use('/api/v1/holidays/', holidaysRouter)

const server = http.createServer(app)

const io = configureWebSocket(server)

app.set('socketio', io)

server.listen(PORT, () => logger.info('Running', PORT))
