const Joi = require('joi');

exports.patchStuffSchema = Joi.object({
  first_name: Joi.string(),
  last_name: Joi.string(),
  role: Joi.string().valid('teacher', 'super_admin', 'admin', 'assistent_teacher'),
  username: Joi.string().min(5).max(10),
  password: Joi.string().min(5),
});
