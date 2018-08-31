'use strict'

const fetch = require('node-fetch')
const genericHelper = require('./genericHelper');
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


  function customerKpiPost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',customerKpiPostAfterMutationHandler, data)
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

  function customerKpiPostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function customerKpiPut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',customerKpiPutAfterMutationHandler, data, id)
  }

  function customerKpiPutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function customerKpiPatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.custKpiFormula
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',customerKpiPatchAfterMutationHandler, data, id)
  }

  function customerKpiPatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function customerKpiDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',customerKpiDeleteFullAfterMutationHandler, data, id)
  }

  function customerKpiDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function customerKpiDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',customerKpiDeleteLogicalAfterMutationHandler, data, id)
  }

  function customerKpiDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

module.exports = {
  post,
  customerKpiPost,
  customerKpiPut,
  customerKpiPatch,
  customerKpiDeleteFull,
  customerKpiDeleteLogical
}
