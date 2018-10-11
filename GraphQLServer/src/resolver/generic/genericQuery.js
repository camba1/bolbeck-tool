'use strict'

//const fetch = require('node-fetch')
const genericHelper = require('./genericHelper');
//const collectionName = 'custKpiFormula'



function genericDocumentsGet (root, args, context) {
  const collectionName = args.collectionName
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.CollectionGet}/${collectionName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,genericDocumentsAfterGetHandler)
}

var genericDocumentsAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}

function genericDocumentGet(parent,args,context) {
  const collectionName = args.collectionName
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,genericDocumentAfterGetHandler)
}

var genericDocumentAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}

function genericDocumentFieldByKey(parent,args,context){
  const collectionName = args.collectionName
  const id = args._key
  const fieldName = args.fieldName
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentFieldByKeyGet}/${collectionName}/${id}/${fieldName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,genericDocumentFieldByKeyAfterGetHandler)
}

var genericDocumentFieldByKeyAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


module.exports = {
  genericDocumentsGet ,
  genericDocumentGet,
  genericDocumentFieldByKey
}
