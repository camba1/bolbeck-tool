module.exports = {
  ...require('./customer/custKpiFormula/query'),
  ...require('./generic/genericQuery'),
  ...require('./product/query'),
  ...require('./product/queryProdHierarchy')
}
