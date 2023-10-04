'use strict'

const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')

const logger = require('../../logs/logger')
const {
    incrementAbsences,
    findUserById,
} = require('../../repositories/users-repository')

async function incrementAbsencesByUserId(req, res) {
    try {
        const { role } = req.auth
        const { idUser } = req.params

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')

        logger.info(
            `Admin con id: ${req.auth.idUser} incrementando faltas del usuario con id: ${idUser}`
        )

        const user = await findUserById(idUser)

        if (!user) throwJsonError(400, 'El usuario no existe')

        await incrementAbsences(idUser)

        logger.info(
            `Admin con id: ${req.auth.idUser} incrementando faltas del usuario con id: ${idUser}`
        )

        res.send({ message: 'Falta incrementada' })
    } catch (err) {
        logger.error(
            `Error: ${err.message} en incrementAbsencesByUserId en users-controller`
        )
        createJsonError(err, res)
    }
}

module.exports = incrementAbsencesByUserId
