/**
* Merges and exposes to the application all GraphQl mutation. Notee that
* since they are all merge as one, they must all have unique names
* @module resolver/mutation
 */
module.exports = {
  ...require('./customer/custKpiFormula/mutation'),
  ...require('./product/mutation'),
  ...require('./customer/customer/mutation'),
  ...require('./invoice/invoice/mutation')
}
