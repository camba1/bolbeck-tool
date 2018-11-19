/**
 * Merges and exposes to the application all GraphQl queries. Notee that
 * since they are all merge as one, they must all have unique names
 * @module resolver/query
 */
module.exports = {
  ...require('./customer/custKpiFormula/query'),
  ...require('./generic/genericQuery'),
  ...require('./product/query'),
  ...require('./product/queryProdHierarchy'),
  ...require('./customer/customer/query'),
  ...require('./invoice/invoice/query'),
  ...require('./invoice/invoice/queryInvoiceByCustomerKey')
}
