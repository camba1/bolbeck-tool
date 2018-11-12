'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  name: joi.string().description('Customer name'),
  validFrom: joi.date().min('1900-01-01')
          .description('Customer valid from'),
  validThru: joi.date().min('1900-01-01')
          .description('Customer valid thru'),
  active: joi.number().integer().min(0).max(1)
          .description('Indicates if the customer is currently active'),
  city: joi.string().description('City in which the customer is located'),
  state: joi.string().description('State in which the customer is located'),
  country: joi.string().description('Country in which the customer is located'),
  zipcode: joi.string().description('Zipcode in which the customer is located')
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
