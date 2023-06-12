const Joi = require("joi");

exports.postStudentSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
})
