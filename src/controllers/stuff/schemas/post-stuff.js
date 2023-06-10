const Joi = require("joi");

exports.postStuffSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  role: Joi.string().valid('teacher', 'super_admin', 'admin', 'assistent_teacher').required(),
  username: Joi.string().required().min(5).max(10),
  password: Joi.string().required().min(5),
})
