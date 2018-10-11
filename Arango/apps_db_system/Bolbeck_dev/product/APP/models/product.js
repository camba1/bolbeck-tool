'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum().description('Product Primary Key'),
  name: joi.string().required().description('Product name'),
  hierarchyLevel: joi.string().required().description('Level of the product in the hierarchy'),
  type: joi.string().alphanum().required().description('Product type'),
  validFrom: joi.date().min('1900-01-01').required().description('Product valid from'),
  validThru: joi.date().min('1900-01-01').required().description('Product valid thru'),
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
  }
};
