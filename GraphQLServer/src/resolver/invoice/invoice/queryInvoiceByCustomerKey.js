'use strict'


const genericHelper = require('../../generic/genericHelper');
const collectionName = 'invoice'


/**
 * Get invoices from the DB given a patircular customer key
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created invoice object
 */
function invoicesByCustomerKeyGet(parent,args,context) {
  debugger
  const id  = args.customerKey
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.invoice
  const queryParams = genericHelper.encodeQueryParams(args.input, true)
  const endPoint = `${collectionName}ByCustomerKeyGet/${id}${queryParams}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,invoicesByCustomerKeyAfterGetHandler)
}

/**
 * Event handler called after a invoice has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created invoice object
 * @return empty
 */
var invoicesByCustomerKeyAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}

/**
* Query for all invoices object operations
* @module resolver/invoice/query
 */
module.exports = {
  invoicesByCustomerKeyGet
}
