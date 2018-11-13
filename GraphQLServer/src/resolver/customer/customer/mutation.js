'use strict'

const fetch = require('node-fetch')
const genericHelper = require('../../generic/genericHelper');
const collectionName = 'customer'


// customer end points

/**
 * GraphQL Wrapper to save customers throught the REST interface to the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created customer object
 */
  function customerPost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.customer
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',customerPostAfterMutationHandler, data)
  }

/**
 * Event handler called after the a customer has been  created in the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created customer object
 * @return Newly created customer object
 */
  function customerPostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to replace customers throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Replaced customer object
   */
  function customerPut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.customer
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',customerPutAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a customer has been replaced in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created customer object
   * @return Replaced customer object
   */
  function customerPutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to update customers throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Updated customer object
   */
  function customerPatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.customer
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',customerPatchAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a customer has been updated in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created customer object
   * @return Updated customer object
   */
  function customerPatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to physically delete customers throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function customerDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',customerDeleteFullAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a customer has been physically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created customer object
   * @return empty
   */
  function customerDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to logically delete customers throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function customerDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',customerDeleteLogicalAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a customer has been logically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created customer object
   * @return empty
   */
  function customerDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
  * Resolvers for all customer object operations
  * @module resolver/customer/mutation
   */
module.exports = {
  customerPost,
  customerPut,
  customerPatch,
  customerDeleteFull,
  customerDeleteLogical
}
