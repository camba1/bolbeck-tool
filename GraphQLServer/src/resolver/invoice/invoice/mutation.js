'use strict'

const fetch = require('node-fetch')
const genericHelper = require('../../generic/genericHelper');
const collectionName = 'invoice'


// invoice end points

/**
 * GraphQL Wrapper to save invoices throught the REST interface to the DB
 *@param root GraphQL standard parent parameter
 *@param args GrapQL standard arguments containing the query arguments
 *@param context GraphQL standard container to share information among resolvers
 *@return Newly created invoice object
 */
  function invoicePost(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.invoice
    const endPoint = `${collectionName}Post`
    const data = args.input
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'post',invoicePostAfterMutationHandler, data)
  }

/**
 * Event handler called after the a invoice has been  created in the DB but
 * before the response is sent back to the client
 * @param serverResponse  Newly created invoice object
 * @return Newly created invoice object
 */
  function invoicePostAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to replace invoices throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Replaced invoice object
   */
  function invoicePut(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.invoice
    const endPoint = `${collectionName}Put`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'put',invoicePutAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a invoice has been replaced in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created invoice object
   * @return Replaced invoice object
   */
  function invoicePutAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to update invoices throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return Updated invoice object
   */
  function invoicePatch(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.invoice
    const endPoint = `${collectionName}Patch`
    const data = args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'patch',invoicePatchAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a invoice has been updated in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created invoice object
   * @return Updated invoice object
   */
  function invoicePatchAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to physically delete invoices throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function invoiceDeleteFull(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteFull}/${collectionName}`
    const data = undefined //args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',invoiceDeleteFullAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a invoice has been physically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created invoice object
   * @return empty
   */
  function invoiceDeleteFullAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
   * GraphQL Wrapper to logically delete invoices throught the REST interface to the DB
   *@param root GraphQL standard parent parameter
   *@param args GrapQL standard arguments containing the mutation arguments
   *@param context GraphQL standard container to share information among resolvers
   *@return empty
   */
  function invoiceDeleteLogical(root, args, context) {
    const backendURL = context.backendURL
    const foxxMountPoint = context.foxxServMountPoints.generic
    const endPoint = `${context.foxxServGenericEndPoints.DocumentByKeyDeleteLogical}/${collectionName}`
    const data = undefined // args.input
    const id  = args._key
    return genericHelper.fetchMutation(backendURL,foxxMountPoint, endPoint,'delete',invoiceDeleteLogicalAfterMutationHandler, data, id)
  }

  /**
   * Event handler called after the a invoice has been logically deleted in the DB but
   * before the response is sent back to the client
   * @param serverResponse  Newly created invoice object
   * @return empty
   */
  function invoiceDeleteLogicalAfterMutationHandler(serverResponse){
    // Do something here if needed
    return serverResponse
  }

  /**
  * Resolvers for all invoice object operations
  * @module resolver/invoice/mutation
   */
module.exports = {
  invoicePost,
  invoicePut,
  invoicePatch,
  invoiceDeleteFull,
  invoiceDeleteLogical
}
