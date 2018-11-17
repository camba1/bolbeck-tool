'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum().description('invoice Primary Key'),
  _id: joi.string().description('Invoice id'),
  invoiceDate: joi.date().min('1900-01-01')
              .description('Date of invoicing'),
  //totAmount: joi.number().precision(2).description('Total monetary value of the invoice'),
  invoBillTo_key: joi.string().required().alphanum().description('invoBillTo Primary Key'),
  customer_key: joi.string().alphanum().description('Customer Primary Key')//,
  // products: joi.object().keys({
  //       product_key: joi.string().alphanum().required().description('Product key'),
  //       invoContains_key: joi.string().alphanum().required().description('invoContains Primary Key'),
  //       dateAdded: joi.date().min('1900-01-01'),
  //       unitPrice: joi.number().positive().precision(2).default(0, 'Defaults to zero')
  //                 .description('Price per unit paid by customer'),
  //       quantity: joi.number().integer().default(0, 'Defaults to zero')
  //                 .description('Quantity of product sold')
  //         }).description('Products sold in the invoice')
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
