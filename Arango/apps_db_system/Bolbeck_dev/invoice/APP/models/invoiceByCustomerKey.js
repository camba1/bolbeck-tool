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
  customerName: joi.string().description('Customer name'),
  products: joi.object().keys({
        product_key: joi.string().alphanum().required().description('Product key'),
        product_id: joi.string().description('Product id'),
        productName: joi.string().description('Product name'),
        invoContains_key: joi.string().alphanum().required().description('invoContains Primary Key'),
        dateAdded: joi.date().min('1900-01-01').default(new Date(), 'Defaults to current date'),
        unitPrice: joi.number().positive().precision(2).default(0, 'Defaults to zero')
                  .description('Price per unit paid by customer'),
        quantity: joi.number().integer().default(0, 'Defaults to zero')
                  .description('Quantity of product sold')
          }).description('Products sold in the invoice')
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
