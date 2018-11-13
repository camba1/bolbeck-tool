'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum().description('Customer Primary Key'),
  _id: joi.string().alphanum().description('Customer internal identifiyer'),
  name: joi.string().required().description('Customer name'),
  validFrom: joi.date().min('1900-01-01').default(new Date(), 'Defaults to current date')
          .description('Customer valid from'),
  validThru: joi.date().min('1900-01-01').default('3000-12-31', 'Defaults to 3000-12-31')
          .description('Customer valid thru'),
  active: joi.number().integer().min(0).max(1)
          .default(0,'customers will be inactive by default on creation')
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
  }
};
