const winston = require('winston')
const { combine, timestamp, printf } = winston.format

// Configuración del formato de registro
const logFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level.toUpperCase()}: ${message}`
})

// Configuración del transportista (destino) de los registros
const logger = winston.createLogger({
    level: 'info',
    format: combine(timestamp(), logFormat),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs.log',
            maxsize: 10485760, // 10MB
            maxFiles: 5,
            tailable: true,
            zippedArchive: true,
            datePattern: 'YYYY-MM-DD',
        }),
    ],
})

module.exports = logger
