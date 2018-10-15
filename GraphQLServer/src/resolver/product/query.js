'use strict'


const genericHelper = require('../generic/genericHelper');
const collectionName = 'product'


// queries

/**
 * Get list of product from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created Product object
 */
function products(root, args, context) {
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.CollectionGet}/${collectionName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,productsAfterGetHandler, args)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //// return fetch(`${backendURL}/${foxxMountPoint}/genericCollectionGet/${collectionName}`).then(res => res.json())
}

/**
 * Event handler called after the list of products has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created product object
 * @return empty
 */
var productsAfterGetHandler = (serverResponse,args) => {
//Do something here if needed
//here we can manipulate the repsonse before it is sent back to the client. Or we could have
//asked the db to filter the data before
    return serverResponse
}

/**
 * Get a product from the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created Product object
 */
function product(parent,args,context) {
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,productAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentByKeyGet/${collectionName}/${id}`).then(res => res.json())
}

/**
 * Event handler called after a product has been retrieved from the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created product object
 * @return empty
 */
var productAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


/**
* Query for all products object operations
* @module resolver/product/query
 */
module.exports = {
  products,
  product
}
