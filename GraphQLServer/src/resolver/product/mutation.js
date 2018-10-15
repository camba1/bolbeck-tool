'use strict'

const fetch = require('node-fetch')
const genericHelper = require('../generic/genericHelper');
const collectionName = 'product'


// product end points

/**
 * GraphQL Wrapper to save products throught the REST interface to the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created Product object
 */
  function productPost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',productPostAfterMutationHandler, data)
  }

/**
 * Event handler called after the a product has been  created in the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created product object
 * @return Newly created product object
 */
  function productPostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to replace products throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Replaced Product object
   */
  function productPut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',productPutAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a product has been replaced in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created product object
   * @return Replaced product object
   */
  function productPutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to update products throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Updated Product object
   */
  function productPatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.product
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',productPatchAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a product has been updated in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created product object
   * @return Updated product object
   */
  function productPatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to physically delete products throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function productDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',productDeleteFullAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a product has been physically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created product object
   * @return empty
   */
  function productDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to logically delete products throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function productDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',productDeleteLogicalAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a product has been logically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created product object
   * @return empty
   */
  function productDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
  * Resolvers for all product object operations
  * @module resolver/product/mutation
   */
module.exports = {
  productPost,
  productPut,
  productPatch,
  productDeleteFull,
  productDeleteLogical
}
