const joi = require('joi');

const docSchema = joi.object().required().keys({
  _key: joi.string().alphanum(),
}).unknown(); // allow additional attributes


module.exports.docSchema = docSchema;
module.exports.patchSchema = docSchema;
