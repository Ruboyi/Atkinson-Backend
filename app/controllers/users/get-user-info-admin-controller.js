'use strict'

const Joi = require('joi')
const createJsonError = require('../../errors/create-json-error')
const throwJsonError = require('../../errors/throw-json-error')
const { findUserById } = require('../../repositories/users-repository')
const logger = require('../../logs/logger')
const {
    getNumberOfAppointmentsByUserIdBeforeNow,
    getNumberOfAppointmentsCanceledByUserId,
} = require('../../repositories/appointment-repository')
const schema = Joi.number().integer().positive().required()

async function getUserInfoAdminById(req, res) {
    try {
        const { role } = req.auth
        const { idUser } = req.params

        if (role !== 'admin') throwJsonError(401, 'Acceso denegado')
        await schema.validateAsync(idUser)

        const user = await findUserById(idUser)

        const numberApointments =
            await getNumberOfAppointmentsByUserIdBeforeNow(idUser)
        const numberApointmentsCanceled =
            await getNumberOfAppointmentsCanceledByUserId(idUser)
        logger.info(`Admin accediendo a perfil con id: ${idUser}`)

        if (!user) {
            throwJsonError(400, 'El usuario no existe')
        }

        const userInfo = {
            idUser: user.idUser,
            nameUser: user.nameUser,
            email: user.email,
            phone: user.phone,
            image: user.image,
            createdAt: user.createdAt,
            numberApointments: numberApointments,
            canceledAppointments: numberApointmentsCanceled,
            absences: user.absences,
        }

        logger.info(
            `Admin a accedido a la información de usuario con id: ${idUser}`
        )

        res.status(200)
        res.send(userInfo)
    } catch (error) {
        const { idUser } = req.params
        logger.error(
            `Error al acceder al perfil del usuario con id:${idUser}`,
            error
        )
        createJsonError(error, res)
    }
}

module.exports = getUserInfoAdminById
