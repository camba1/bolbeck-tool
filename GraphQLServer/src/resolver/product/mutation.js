'use strict'

const fetch = require('node-fetch')
const genericHelper = require('./genericHelper');
const collectionName = 'product'


// product end points

  function productPost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',productPostAfterMutationHandler, data)
  }

  function productPostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function productPut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',productPutAfterMutationHandler, data, id)
  }

  function productPutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function productPatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',productPatchAfterMutationHandler, data, id)
  }

  function productPatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function productDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',productDeleteFullAfterMutationHandler, data, id)
  }

  function productDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  function productDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',productDeleteLogicalAfterMutationHandler, data, id)
  }

  function productDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

module.exports = {
  post,
  productPost,
  productPut,
  productPatch,
  productDeleteFull,
  productDeleteLogical
}
