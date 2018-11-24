'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum().description('invoice Primary Key'),
  _id: joi.string().description('Invoice id'),
  invoiceDate: joi.date().min('1900-01-01').default(new Date(), 'Defaults to current date')
              .required().description('Date of invoicing'),
  totAmount: joi.number().precision(2).description('Total monetary value of the invoice'),
  invoBillTo_key: joi.string().alphanum().required().description('invoBillTo Primary Key'),
  customer_key: joi.string().alphanum().required().description('Customer Primary Key'),
  customer_id: joi.string().description('Customer id'),
  customerName: joi.string().description('Customer name')//,
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
