const Joi = require('joi');
const { createAppointment } = require('../../repositories/appointment-repository');
const createJsonError = require('../../errors/create-json-error');
const throwJsonError = require('../../errors/throw-json-error');

const schema = Joi.object().keys({
  userId: Joi.number().required(),
  barberId: Joi.number().required(),
  appointmentDate: Joi.date().required(),
  serviceId: Joi.number().required()
});

async function createAppointmentController(req, res) {
  try {
    const { body } = req;
    await schema.validateAsync(body);

    const appointment = await createAppointment(body);

    res.status(201).json({idAppointment :appointment});
  } catch (error) {
    if (error.name === 'ValidationError') {
      throwJsonError(400, 'Invalid appointment data', error.details);
    } else {
      createJsonError(error, res);
    }
  }
}

module.exports = createAppointmentController;
