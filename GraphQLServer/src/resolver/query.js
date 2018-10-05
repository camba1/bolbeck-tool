'use strict'

//const fetch = require('node-fetch')
const genericHelper = require('./genericHelper');
const collectionName = 'custKpiFormula'


function info() {
    return  'This is the API for my program'
}

function feed(root, args, context){
  //return links
  return context.myLinkObj
}

//custKpiFormula queries

function custKpiFormulas(root, args, context) {
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.CollectionGet}/${collectionName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,custKpiFormulasAfterGetHandler, args)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //// return fetch(`${backendURL}/${foxxMountPoint}/genericCollectionGet/${collectionName}`).then(res => res.json())
}

var custKpiFormulasAfterGetHandler = (serverResponse,args) => {
//Do something here if needed
//here we can manipulate the repsonse before it is sent back to the client. Or we could have
//asked the db to filter the data before
if (args.name) {
  let matchLength = args.name.length;
  for (let i = serverResponse.length-1; i >= 0; i--) {
      if (serverResponse[i].name.substring(0, matchLength) != args.name) {
          serverResponse.splice(i, 1);
      }
  }
}
    return serverResponse
}

function custKpiFormula(parent,args,context) {
  const id  = args._key
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyGet}/${collectionName}/${id}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,custKpiFormulaAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentByKeyGet/${collectionName}/${id}`).then(res => res.json())
}

var custKpiFormulaAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}

function custKpiFormulaFieldByKey(parent,args,context){
  const id = args._key
  const fieldName = args.fieldName
  const backendURL = context.backendURL
  const foxxMountPoint = context.foxxServMountPoints.generic
  const endPoint = `${context.foxxServGenericEndPoints.DocumentFieldByKeyGet}/${collectionName}/${id}/${fieldName}`
  return genericHelper.fetchQuery(backendURL,foxxMountPoint,endPoint,custKpiFormulaFieldByKeyAfterGetHandler)
  //return fetch(genericHelper.buildURL(backendURL,foxxMountPoint,endPoint)).then(res => res.json())
  //return fetch(`${backendURL}/${foxxMountPoint}/genericDocumentFieldByKeyGet/${collectionName}/${id}/${fieldName}`).then(res => res.json())
}

var custKpiFormulaFieldByKeyAfterGetHandler = (serverResponse) => {
//Do something here if needed
    return serverResponse
}


module.exports = {
  info,
  feed,
  custKpiFormulas,
  custKpiFormula,
  custKpiFormulaFieldByKey,
  ...require('./genericQuery')
}
