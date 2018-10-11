'use strict'

const fetch = require('node-fetch')
const genericHelper = require('../../generic/genericHelper');
const collectionName = 'custKpiFormula'

function post(root, args, context) {
    const link = {
      //id: `link-${idCount++}`,
      id: `link-${context.myLinkIdCount++}`,
      description: args.description,
      url: args.url
    }
  //  links.push(link)
  context.myLinkObj.push(link)
    return link
  }


// custKpiFormula end points

  function custKpiFormulaPost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',custKpiFormulaPostAfterMutationHandler, data)
    // var mutationRequest = genericHelper.buildMutationRequest(backendURL,foxxMountPoint, endPoint,'post', data)
    // return fetch( mutationRequest ).then(res => res.json())
    // .catch(error => console.error('Error:', error));
    // return fetch(`${backendURL}/${foxxMountPoint}/${collectionName}Post`,
    //   {
    //     method: "POST",
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Accept': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    //   }
    // ).then(res => res.json())
    // //.then(response => console.log('Success:', JSON.stringify(response)))
  }

  function custKpiFormulaPostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function custKpiFormulaPut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',custKpiFormulaPutAfterMutationHandler, data, id)
  }

  function custKpiFormulaPutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function custKpiFormulaPatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',custKpiFormulaPatchAfterMutationHandler, data, id)
  }

  function custKpiFormulaPatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function custKpiFormulaDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',custKpiFormulaDeleteFullAfterMutationHandler, data, id)
  }

  function custKpiFormulaDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function custKpiFormulaDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',custKpiFormulaDeleteLogicalAfterMutationHandler, data, id)
  }

  function custKpiFormulaDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

module.exports = {
  post,
  custKpiFormulaPost,
  custKpiFormulaPut,
  custKpiFormulaPatch,
  custKpiFormulaDeleteFull,
  custKpiFormulaDeleteLogical
}
