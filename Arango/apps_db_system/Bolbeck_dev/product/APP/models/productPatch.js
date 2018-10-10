'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  name: joi.string().description('Product name'),
  hierarchyLevel: joi.string().description('Level of the product in the hierarchy'),
  type: joi.string().alphanum().description('Product type'),
  validFrom: joi.date().min('1900-01-01').description('Product valid from'),
  validThru: joi.date().min('1900-01-01').description('Product valid thru'),
}).unknown(); // allow additional attributes


module.exports = {
  schema: docSchema,
  forClient(obj) {
    // Implement outgoing transformations here
    return obj;
  },
  fromClient(obj) {
    // Implement incoming transformations here
    return obj;
  },
  fromClientDelete(key) {
    //Implement incoming validations here
    return key;
  }
};
