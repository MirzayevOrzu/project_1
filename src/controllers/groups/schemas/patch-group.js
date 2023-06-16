const Joi = require('joi');

exports.postGroupSchema = Joi.object({
  name: Joi.string(),
  teacher_id: Joi.number(),
  assistent_teacher_id: Joi.number(),
});
