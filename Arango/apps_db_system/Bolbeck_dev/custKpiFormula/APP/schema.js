const joi = require('joi');

const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum(),
  name: joi.string().required(),
  formula: joi.string().required(),
  type: joi.string().alphanum().required(),
  validityDate: joi.date().min('1900-01-01').required(),
  calculationOrder: joi.number().integer().required(),
  editable: joi.number().integer().min(0).max(1),
  active: joi.number().integer().min(0).max(1),
  displayOrder: joi.number().integer()
}).unknown(); // allow additional attributes

const patchSchema = joi.object().required().keys({
  name: joi.string(),
  formula: joi.string(),
  type: joi.string().alphanum(),
  validityDate: joi.date().min('1900-01-01'),
  calculationOrder: joi.number().integer(),
  editable: joi.number().integer().min(0).max(1),
  active: joi.number().integer().min(0).max(1),
  displayOrder: joi.number().integer()
}).unknown(); // allow additional attributes

module.exports.docSchema = docSchema;
module.exports.patchSchema = patchSchema;
