'use strict';
const _ = require('lodash');
const joi = require('joi');
const custKpiFormulaModel = require('./custKpiFormula')

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


module.exports = {
  schema: patchSchema,
  forClient(obj) {
    // Implement outgoing transformations here
    return custKpiFormulaModel.forClient(obj);
  },
  fromClient(obj) {
    // Implement incoming transformations here
    return custKpiFormulaModel.fromClient(obj);
  }
};
