'use strict';
const _ = require('lodash');
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


module.exports = {
  schema: docSchema,
  forClient(obj) {
    // Implement outgoing transformations here
    console.log('Here I am');
    obj = _.omit(obj, ['_id', '_rev', '_oldRev']);
    return obj;
  },
  fromClient(obj) {
    // Implement incoming transformations here
    console.log('I am Here');
    return obj;
  },
  fromClientDelete(key) {
    //Implement incoming validations here
    return key;
  }
};
