'use strict'


const genericHelper = require('../../generic/genericHelper');
const collectionName = 'customer'


// queries

/**
 * Get list of customer from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created customer object
 */
function customers(root, args, context) {
  const backendURL = context.backendURL
  //const foxxMountPoint = context.foxxServMountPoints.generic
  //const endPoint = `${context.foxxServGenericEndPoints.CollectionGet}/${collectionName}`
  const foxxMountPoint = context.foxxServMountPoints.customer
  const queryParams = genericHelper.encodeQueryParams(args.input, true)
  const endPoint = `${collectionName}Get${queryParams}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,customersAfterGetHandler, args)
}

/**
 * Event handler called after the list of customers has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created customer object
 * @return empty
 */
var customersAfterGetHandler = (serverResponse,args) => {
//Do something here if needed
//here we can manipulate the repsonse before it is sent back to the client. Or we could have
//asked the db to filter the data before
    return serverResponse
}

/**
 * Get a customer from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created customer object
 */
function customer(parent,args,context) {
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,customerAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentByKeyGet/${collectionName}/${id}`).then(res => res.json())
}

/**
 * Event handler called after a customer has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created customer object
 * @return empty
 */
var customerAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


/**
* Query for all customers object operations
* @module resolver/customer/query
 */
module.exports = {
  customers,
  customer
}
