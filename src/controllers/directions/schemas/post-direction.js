const Joi = require('joi');

exports.postDirectionSchema = Joi.object({
  name: Joi.string().required(),
});
