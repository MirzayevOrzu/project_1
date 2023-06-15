const Joi = require('joi');

exports.patchDirectionSchema = Joi.object({
  name: Joi.string().required(),
});
