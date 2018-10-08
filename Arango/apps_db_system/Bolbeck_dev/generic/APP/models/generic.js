'use strict';
const _ = require('lodash');
const joi = require('joi');

const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum()
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
