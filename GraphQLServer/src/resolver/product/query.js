'use strict'


const genericHelper = require('../genericHelper');
const collectionName = 'product'


// queries

function products(root, args, context) {
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.CollectionGet}/${collectionName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,productsAfterGetHandler, args)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //// return fetch(`${backendURL}/${foxxMountPoint}/genericCollectionGet/${collectionName}`).then(res => res.json())
}

var productsAfterGetHandler = (serverResponse,args) => {
//Do something here if needed
//here we can manipulate the repsonse before it is sent back to the client. Or we could have
//asked the db to filter the data before
    return serverResponse
}

function product(parent,args,context) {
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,productAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentByKeyGet/${collectionName}/${id}`).then(res => res.json())
}

var productAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}



module.exports = {
  products,
  product
}
