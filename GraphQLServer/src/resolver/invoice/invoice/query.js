'use strict'


const genericHelper = require('../../generic/genericHelper');
const collectionName = 'invoice'


// queries

/**
 * Get list of invoice from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created invoice object
 */
function invoices(root, args, context) {
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.invoice
  const queryParams = genericHelper.encodeQueryParams(args.input, true)
  const endPoint = `${collectionName}Get${queryParams}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,invoicesAfterGetHandler, args)
}

/**
 * Event handler called after the list of invoices has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created invoice object
 * @return empty
 */
var invoicesAfterGetHandler = (serverResponse,args) => {
//Do something here if needed
//here we can manipulate the repsonse before it is sent back to the client. Or we could have
//asked the db to filter the data before
    return serverResponse
}

/**
 * Get an invoice from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created invoice object
 */
function invoice(parent,args,context) {
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.invoice
  const queryParams = genericHelper.encodeQueryParams(args.input, true)
  const endPoint = `${collectionName}Get/${id}${queryParams}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,invoiceAfterGetHandler)
}

/**
 * Event handler called after a invoice has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created invoice object
 * @return empty
 */
var invoiceAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


/**
* Query for all invoices object operations
* @module resolver/invoice/query
 */
module.exports = {
  invoices,
  invoice
}
