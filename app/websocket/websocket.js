const socketIO = require('socket.io')
const logger = require('../logs/logger')

function configureWebSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            credentials: true,
        },
    })
    // Configura los eventos que el servidor escuchará desde el cliente
    io.on('connection', socket => {
        logger.info('Nuevo cliente conectado conectado al socket')

        // Escucha el evento 'disconnect' para manejar la desconexión del cliente
        socket.on('disconnect', () => {
            logger.info('Cliente desconectado del socket')
        })
    })

    return io
}

module.exports = configureWebSocket
