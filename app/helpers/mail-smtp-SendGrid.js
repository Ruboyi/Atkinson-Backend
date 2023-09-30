'use strict'

const sgMail = require('@sendgrid/mail')
const createJsonError = require('../errors/create-json-error')
const logger = require('../logs/logger')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const { HTTP_SERVER, FRONTEND_URL } = process.env

async function sendMailRegister(name, email, code) {
    try {
        const linkActivation = `${HTTP_SERVER}/api/v1/users/activation?code=${code}`

        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject: 'Bienvenido a Atkinson Barber Shop',
            html: `
        <div style="text-align: center;">
          <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
          <h1>Bienvenido a Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Gracias por confiar en nosotros. Para activar la cuenta haz click en el boton que te muestro a continuación: </p>
          <a href="${linkActivation}" style="display: inline-block; padding: 12px 24px; background-color: #d96c2c; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px;">Activar Cuenta</a>
        </div>
      `,
        }

        const data = await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un mail de activación`
        )
        return data
    } catch (error) {
        logger.error(`Error al enviar el mail de activación a ${email}`, error)
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailCorrectValidation(name, email) {
    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject: 'Atkinson Barber Shop - Cuenta activada',
            html: `<div style="text-align: center;">
      <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
      <h1>Atkinson Barber Shop</h1>
      <p>Hola ${name},</p>
      <p>Gracias por confiar en nosotros. Su cuenta ha sido activada correctamente</p>
    
    </div>`,
        }

        const data = await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un mail de agradecimiento de activación`
        )
        return data
    } catch (error) {
        logger.error(
            `Error al enviar el mail de agradecimiento de activación a ${email}`,
            error
        )
        throw new Error('Error al enviar el mail')
    }
}

async function sendMailPurchaseOrderNotif(name, email) {
    const msg = {
        to: email,
        from: process.env.SENDGRID_FROM,
        subject: 'Arcade Marketplace - New Message!',
        text: `Hi ${name},
    There's someone interested in one of your products.
    Check the app to see more details.`,
        html: `<h1>Hi ${name},</h1>
    <p>There's someone interested in one of your products.
    Check the app to see more details.</p>`,
    }

    const data = await sgMail.send(msg)
    return data
}

async function sendMailRecoveryPassword(name, email, temporaryPassword) {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
            to: email,
            from: {
                name: 'Atkinson Barber Shop',
                email: process.env.SENDGRID_FROM,
            },
            subject: 'Atkinson Barber Shop - Restablecimiento de contraseña',
            html: `
        <div style="text-align: center;">
          <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>A continuación, encontrarás tu contraseña temporal:</p>
          <p><strong>${temporaryPassword}</strong></p>
          <p>Por favor, inicia sesión con esta contraseña temporal y cambia tu contraseña lo antes posible.</p>
          <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico.</p>
          <p>Atentamente,</p>
          <p>Equipo de Atkinson Barber Shop</p>
        </div>
      `,
        }

        await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un mail de recuperación de contraseña`
        )
    } catch (error) {
        logger.error(
            `Error al enviar el mail de recuperación de contraseña a ${email}}`,
            error
        )
        throw new Error('Error al enviar el correo electrónico')
    }
}

async function sendMailRecoveryPassword(name, email, verificationCode) {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const msg = {
            to: email,
            from: {
                name: 'Atkinson Barber Shop',
                email: process.env.SENDGRID_FROM,
            },
            subject: 'Atkinson Barber Shop - Restablecimiento de contraseña',
            html: `
        <div style="text-align: center;">
          <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
          <h1>Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
          <p>A continuación, encontrarás tu código de verificación:</p>
          <p><strong>${verificationCode}</strong></p>
          <p>Ingresa este código en la aplicación para completar el proceso de restablecimiento de contraseña.</p>
          <p>Si no solicitaste restablecer tu contraseña, ignora este correo electrónico.</p>
          <p>Atentamente,</p>
          <p>Equipo de Atkinson Barber Shop</p>
        </div>
      `,
        }

        await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un mail de recuperación de contraseña`
        )
    } catch (error) {
        logger.error(
            `Error al enviar el mail de recuperación de contraseña a ${email}`,
            error
        )
        throw new Error('Error al enviar el correo electrónico')
    }
}

async function sendMailCitaActualizada(name, email, newDate) {
    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject: 'Actualización de cita en Atkinson Barber Shop',
            html: `
          <div style="text-align: center;">
            <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
            <h1>Atkinson Barber Shop</h1>
            <p>Hola ${name},</p>
            <p>Tu cita ha sido actualizada por el administrador debido a motivos de concurrencia.</p>
            <p>La nueva fecha de tu cita es: ${newDate}</p>
            <p>Por favor, contáctanos si tienes alguna pregunta o necesitas más información.</p>
            <p>Gracias por tu comprensión.</p>
          </div>
        `,
        }

        const data = await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un correo electrónico de actualización de cita`
        )
        return data
    } catch (error) {
        logger.error(
            `Error al enviar el correo electrónico de actualización de cita a ${email}`,
            error
        )
        throw new Error('Error al enviar el correo electrónico')
    }
}

async function sendMailCitaCancelada(name, email) {
    try {
        const msg = {
            to: email,
            from: process.env.SENDGRID_FROM,
            subject: 'Cancelación de cita en Atkinson Barber Shop',
            html: `
          <div style="text-align: center;">
            <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
            <h1>Atkinson Barber Shop</h1>
            <p>Hola ${name},</p>
            <p>Lamentamos informarte que tu cita ha sido cancelada.</p>
            <p>Contactar con el admistrador para mas información</p>
            <p>Te pedimos disculpas por cualquier inconveniente que esto pueda causarte.</p>
            <p>Si deseas programar una nueva cita, por favor contáctanos.</p>
            <p>Gracias por tu comprensión.</p>
          </div>
        `,
        }

        const data = await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un correo electrónico de cancelación de cita`
        )
        return data
    } catch (error) {
        logger.error(
            `Error al enviar el correo electrónico de cancelación de cita a ${email}`,
            error
        )
        throw new Error('Error al enviar el correo electrónico')
    }
}

// Función para generar la URL de recuperación con el verificationCode
function generateRecoveryURL(verificationCode) {
    const baseUrl = 'https://tu-sitio-web.com/recuperar-contrasena' // Reemplaza con la URL de tu sitio web
    const recoveryUrl = `${baseUrl}?code=${verificationCode}`
    return recoveryUrl
}

async function sendMailRecoveryPasswordWeb(name, email, verificationCode) {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)

        const recoveryUrl = generateRecoveryURL(verificationCode)

        const msg = {
            to: email,
            from: {
                name: 'Atkinson Barber Shop',
                email: process.env.SENDGRID_FROM,
            },
            subject: 'Atkinson Barber Shop - Restablecimiento de Contraseña',
            html: `
                <div style="text-align: center;">
                    <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
                    <h1>Atkinson Barber Shop</h1>
                    <p>Estimado/a ${name},</p>
                    <p>Recibimos una solicitud para restablecer su contraseña en Atkinson Barber Shop.</p>
                    <p>A continuación, encontrará su código de verificación:</p>
                    <p><strong>${verificationCode}</strong></p>
                    <p>Por favor, utilice este código en nuestra plataforma para completar el proceso de restablecimiento de contraseña.</p>
                    <p>Si no solicitó restablecer su contraseña, por favor ignore este correo electrónico.</p>
                    <p>Para recuperar su contraseña, haga clic en el siguiente enlace:</p>
                    <p><a href="${recoveryUrl}">${recoveryUrl}</a></p>
                    <p>Atentamente,</p>
                    <p>El Equipo de Atkinson Barber Shop</p>
                </div>
            `,
        }

        await sgMail.send(msg)
        logger.info(
            `Usuario con email: ${email} ha recibido un correo de recuperación de contraseña`
        )
    } catch (error) {
        logger.error(
            `Error al enviar el correo de recuperación de contraseña a ${email}`,
            error
        )
        throw new Error('Error al enviar el correo electrónico')
    }
}

module.exports = {
    sendMailRegister,
    sendMailCorrectValidation,
    sendMailRecoveryPasswordWeb,
    sendMailPurchaseOrderNotif,
    sendMailRecoveryPassword,
    sendMailCitaActualizada,
    sendMailCitaCancelada,
}
