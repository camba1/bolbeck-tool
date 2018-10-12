'use strict';
const _ = require('lodash');
const joi = require('joi');


const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum().required().description('Product Primary Key'),
  name: joi.string().required().description('Product name'),
  validFrom: joi.date().min('1900-01-01').required().description('Product valid from'),
  validThru: joi.date().min('1900-01-01').required().description('Product valid thru'),
  hierarchyLevel: joi.string().required().description('Level of the product in the hierarchy'),
  eFrom: joi.string().required().description('Product identifier of relationship from node'),
  eTo: joi.string().required().description('Product identifier of relationship to node'),
  e_Key: joi.string().alphanum().required().description('Hierarchy Primary Key'),
  eValidFrom: joi.date().min('1900-01-01').required().description('Hierarchy valid from'),
  eValidThru: joi.date().min('1900-01-01').required().description('Hierarchy valid thru')
}).unknown(); // allow additional attributes


module.exports = {
  schema: docSchema,
  forClient(obj) {
    // Implement outgoing transformations here
    return obj;
  }
};
