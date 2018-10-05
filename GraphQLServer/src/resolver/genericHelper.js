'use strict'

const fetch = require('node-fetch')
const Request = require('node-fetch').Request

var buildURL = (backendURL,foxxMountPoint,endPoint) =>  `${backendURL}/${foxxMountPoint}/${endPoint}`
var buildUrlEndPoint = (endPoint, docId = '') => endPoint.concat(docId = '' ? '':`/${docId}`)
var json = (response) => response.status == 204 ? {} :  response.json()

function status(response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(new Error(response.statusText))
    }
  }

  function buildMutationRequest(backendURL,foxxMountPoint, endPoint, methodName, data, docId = ''){
    var urlEndPoint = buildUrlEndPoint(endPoint, docId)
    const url = buildURL(backendURL,foxxMountPoint,urlEndPoint)
    var initRequest = {
            method: methodName.toUpperCase(),
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(data)
          }
    return new Request(url, initRequest);
  }

  function fetchMutation (backendURL,foxxMountPoint, endPoint,methodName,afterMutationHandler, data, docId = '') {
    var mutationRequest = buildMutationRequest(backendURL,foxxMountPoint, endPoint,methodName, data, docId)
    return fetch( mutationRequest )
      .then(json)
      .then(data => afterMutationHandler(data) )
      .catch(function (error) {
        console.log(`Request failed when trying to reach ${endPoint}`, error);
      })
    }

  function fetchQuery(backendURL,foxxMountPoint,endPoint,afterGetHandler, args = undefined){
    return fetch(buildURL(backendURL,foxxMountPoint,endPoint))
      .then(status)
      .then(json)
      .then(data => afterGetHandler(data, args) )
      .catch(function(error) { console.log(`Request failed when trying to reach ${endPoint}`, error) })
  }

  module.exports = {
    fetchQuery,
    fetchMutation,
    buildMutationRequest,
    buildURL
  }
