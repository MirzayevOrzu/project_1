const Joi = require('joi');

exports.patchStudent = Joi.object({
    first_name: Joi.string(),
    last_name: Joi.string(),
});
