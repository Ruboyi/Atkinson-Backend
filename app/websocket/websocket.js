const socketIO = require('socket.io')

function configureWebSocket(server) {
    const io = socketIO(server)

    // Configura los eventos que el servidor escuchará desde el cliente
    io.on('connection', socket => {
        console.log('Nuevo cliente conectado')

        // Escucha el evento 'disconnect' para manejar la desconexión del cliente
        socket.on('disconnect', () => {
            console.log('Cliente desconectado')
        })
    })

    return io
}

module.exports = configureWebSocket
