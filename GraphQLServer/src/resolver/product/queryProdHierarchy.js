'use strict'


const genericHelper = require('../generic/genericHelper');
const collectionName = 'product'
const childCollectionName = 'prodHierarchy'


// queries

function prodHierachy(parent,args,context) {
  const { _key, ...inputWO_key } = args.input
  const id  = _key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.product
  //`${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  const endPointPrefix = `${collectionName}Get/${id}`
  const endPointSuffix = `/${childCollectionName}Get`
  const queryParams = genericHelper.encodeQueryParams(inputWO_key, true)
  const endPoint = endPointPrefix.concat(endPointSuffix).concat(queryParams)
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,prodHierarchyAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentByKeyGet/${collectionName}/${id}`).then(res => res.json())
}

var prodHierarchyAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


module.exports = {
  prodHierachy
}
