'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  invoiceDate: joi.date().min('1900-01-01').default(new Date(), 'Defaults to current date')
              .description('Date of invoicing'),
  invoBillTo: joi.object().keys({
        _key: joi.string().alphanum().required().description('invoBillTo Primary Key'),
        customer_key: joi.string().alphanum().description('Customer Primary Key'),
        customerName: joi.string().description('Customer name'),
        customer_id: joi.string().description('Customer id'),
  }).description('Customer related to the invoice'),
  invoContains: joi.object().keys({
        _key: joi.string().alphanum().required().description('invoContains Primary Key'),
        product_key: joi.string().alphanum().description('Product key'),
        product_id: joi.string().description('Product id'),
        productName: joi.string().description('Product name'),
        dateAdded: joi.date().min('1900-01-01').default(new Date(), 'Defaults to current date'),
        unitPrice: joi.number().positive().precision(2).description('Price per unit paid by customer'),
        quantity: joi.number().positive().integer().description('Quantity of product sold')
          }).description('Products sold in the invoice'),
  type: joi.string().alphanum().required().description('Product type'),
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
