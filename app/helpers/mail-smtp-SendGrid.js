'use strict'

const brevo = require('@getbrevo/brevo')
const logger = require('../logs/logger')

const apiInstance = new brevo.TransactionalEmailsApi()
apiInstance.setApiKey(
    brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY
)

const { HTTP_SERVER, FRONTEND_URL, BREVO_FROM } = process.env

// ========== FUNCIONES ==========

async function sendMailRegister(name, email, code) {
    try {
        const linkActivation = `${HTTP_SERVER}/api/v1/users/activation?code=${code}`
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Bienvenido a Atkinson Barber Shop',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" alt="Logo Atkinson Barber Shop" style="width: 200px;">
          <h1>Bienvenido a Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Gracias por confiar en nosotros. Para activar la cuenta haz click en el botón:</p>
          <a href="${linkActivation}" style="display:inline-block;padding:12px 24px;background-color:#d96c2c;color:#fff;text-decoration:none;border-radius:4px;">Activar Cuenta</a>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
        logger.info(
            `Usuario con email: ${email} ha recibido un mail de activación`
        )
    } catch (error) {
        logger.error(`Error al enviar el mail de activación a ${email}`, error)
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailCorrectValidation(name, email) {
    try {
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Atkinson Barber Shop - Cuenta activada',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" alt="Logo" style="width: 200px;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Su cuenta ha sido activada correctamente</p>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
        logger.info(
            `Usuario con email: ${email} ha recibido email de cuenta activada`
        )
    } catch (error) {
        logger.error(
            `Error al enviar email de cuenta activada a ${email}`,
            error
        )
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailRecoveryPassword(name, email, temporaryPassword) {
    try {
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Atkinson Barber Shop - Restablecimiento de contraseña',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" alt="Logo" style="width: 200px;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p><strong>${temporaryPassword}</strong></p>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        logger.error(`Error al enviar mail de recuperación a ${email}`, error)
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailRecoveryPasswordWeb(name, email, verificationCode) {
    try {
        const recoveryUrl = `${FRONTEND_URL}/reset-password?code=${verificationCode}`
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Atkinson Barber Shop - Restablecimiento de Contraseña',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" style="width: 200px;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Para recuperar tu contraseña, haz clic en el siguiente enlace:</p>
          <a href="${recoveryUrl}">${recoveryUrl}</a>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        logger.error(
            `Error al enviar mail de recuperación web a ${email}`,
            error
        )
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailCitaActualizada(name, email, newDate) {
    try {
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Actualización de cita en Atkinson Barber Shop',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" style="width: 200px;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Tu cita ha sido actualizada a: ${newDate}</p>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        logger.error(
            `Error al enviar email de cita actualizada a ${email}`,
            error
        )
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailCitaCancelada(name, email) {
    try {
        const sendSmtpEmail = {
            sender: { name: 'Atkinson Barber Shop', email: BREVO_FROM },
            to: [{ email }],
            subject: 'Cancelación de cita en Atkinson Barber Shop',
            htmlContent: `
        <div style="text-align: center;">
          <img src="https://www.dafont.com/forum/attach/orig/2/1/217371.gif" style="width: 200px;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Lamentamos informarte que tu cita ha sido cancelada.</p>
        </div>
      `,
        }
        await apiInstance.sendTransacEmail(sendSmtpEmail)
    } catch (error) {
        logger.error(
            `Error al enviar email de cita cancelada a ${email}`,
            error
        )
        throw new Error('Error al enviar el mail')
    }
}

module.exports = {
    sendMailRegister,
    sendMailCorrectValidation,
    sendMailRecoveryPasswordWeb,
    sendMailRecoveryPassword,
    sendMailCitaActualizada,
    sendMailCitaCancelada,
}
