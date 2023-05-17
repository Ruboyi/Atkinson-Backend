"use strict";

const sgMail = require("@sendgrid/mail");
const createJsonError = require("../errors/create-json-error");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const { HTTP_SERVER, FRONTEND_URL } = process.env;

async function sendMailRegister(name, email, code) {

  try {
    const linkActivation = `${HTTP_SERVER}/api/v1/users/activation?code=${code}`;


    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "Bienvenido a Atkinson Barber Shop",
      html: `
        <div style="text-align: center;">
          <img src="https://atkinsonbarbershop.com/wp-content/uploads/2017/06/logoatkinsonheader.png" alt="Logo Atkinson Barber Shop" style="width: 200px; height: auto; margin: 20px auto;">
          <h1>Bienvenido a Atkinson Barber Shop</h1>
          <p>Hola ${name},</p>
          <p>Gracias por confiar en nosotros. Para activar la cuenta haz click en el boton que te muestro a continuación: </p>
          <a href="${linkActivation}" style="display: inline-block; padding: 12px 24px; background-color: #d96c2c; color: #fff; text-decoration: none; border-radius: 4px; margin-top: 20px;">Activar Cuenta</a>
        </div>
      `,
    };

    const data = await sgMail.send(msg);

    return data;
  } catch (error) {
    throw new Error( "Error al enviar el mail");
  }
}

async function sendMailCorrectValidation(name, email) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: "Arcade Marketplace - Account Activated!",
    text: `Hi ${name}, \n Your account was activated.`,
    html: `<h1>Hi ${name},</h1> your account was activated.`,
  };

  const data = await sgMail.send(msg);
  return data;
}

async function sendMailPurchaseOrderNotif(name, email) {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM,
    subject: "Arcade Marketplace - New Message!",
    text: `Hi ${name},
    There's someone interested in one of your products.
    Check the app to see more details.`,
    html: `<h1>Hi ${name},</h1>
    <p>There's someone interested in one of your products.
    Check the app to see more details.</p>`,
  };

  const data = await sgMail.send(msg);
  return data;
}

async function sendMailRecoveryPassword(name, email, code) {
  try {
    const linkRecoveryPassword = `${FRONTEND_URL}/password/${code}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: "Arcade Marketplace info",
      text: `Hola, Ruben:


      Hemos recibido una solicitud para restablecer la contraseña. Pulsa el enlace para crear tu nueva contraseña.
      
      Si no has sido tú quien lo ha solicitado, puedes ignorar este mensaje.
      
      
      Por seguridad, nunca compartas este enlace con otras personas. Desde Arcade Marketplace en ningún caso te pediremos que lo hagas.
      
      ${linkRecoveryPassword}
      `,
      html: `<div>
      Hola,${name}:


      Hemos recibido una solicitud para restablecer la contraseña. Pulsa el enlace para crear tu nueva contraseña.
      
      Si no has sido tú quien lo ha solicitado, puedes ignorar este mensaje.
      
      
      Por seguridad, nunca compartas este enlace con otras personas. Desde Wallapop en ningún caso te pediremos que lo hagas.
      
      <a href='${linkRecoveryPassword}'>Restablece tu contraseña</a>
             </div>`,
    };

    const data = await sgMail.send(msg);

    return data;
  } catch (error) {
    createJsonError(400, "Error al enviar el mail");
  }
}

module.exports = {
  sendMailRegister,
  sendMailCorrectValidation,
  sendMailPurchaseOrderNotif,
  sendMailRecoveryPassword,
};
