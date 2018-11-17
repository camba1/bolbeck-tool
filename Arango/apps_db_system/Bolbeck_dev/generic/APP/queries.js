'use strict';
const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const errors = require('@arangodb').errors;
const DOC_NOT_FOUND = errors.ERROR_ARANGO_DOCUMENT_NOT_FOUND.code;
const COLL_NOT_FOUND = errors.ERROR_ARANGO_COLLECTION_NOT_FOUND.code;
const DOC_DUPLICATE = errors.ERROR_ARANGO_UNIQUE_CONSTRAINT_VIOLATED.code;
const DOC_CONFLICT = errors.ERROR_ARANGO_CONFLICT.code;
const httpError = require('http-errors');
const status = require('statuses');
const HTTP_NOT_FOUND = status('not found');
const HTTP_CONFLICT = status('conflict');

const g_MaxRecordsByQuery = 20;

/**
 * Get a number of documents from a given collection
 * @param {Object} collection collection object that represents a collection in the DB
 * @param {Object} params Query parameters to be used when getting data from DB. Optional
 * @returns Query object to be used to retrieve the data from the DB
 */
var genericCollectionGet = function (collection, params = undefined) {
  var customFilter = "";
  var aqlParams = { };
  let i = 0;

  //Build parameters for query
  if (params) {
    Object.keys(params).forEach(function(key,index) {
      if (params[key]) {
        customFilter += `AND entry.${key} == @value${i} ` ;
        aqlParams[`value${i}`] = params[key];
        i += 1;
      }
    });
    // console.log(customFilter);
  };
  aqlParams['@collection'] = collection.name();
  aqlParams.g_MaxRecordsByQuery = g_MaxRecordsByQuery;

  //Build AQL query
  var query = 'FOR entry IN @@collection FILTER entry.status != "d" ';
  if (customFilter.length > 0) {
    query += customFilter;
  }
  query += ' LIMIT @g_MaxRecordsByQuery RETURN entry';
  // console.log(query);
  // console.log(aqlParams);

  //Build query object
  const documents = db._query(query, aqlParams);

  // const documents = db._query(aql`
  //   FOR entry IN ${collection}
  //   FILTER entry.status != "d"
  //   LIMIT ${g_MaxRecordsByQuery}
  //   RETURN entry`
  // );
  return documents;
};

// Get a document from a collection given a key
var genericDocumentByKeyGet = function (collection, key) {
  const document = db._query(aql`
    FOR entry IN ${collection}
    FILTER entry._key == ${key}
      && entry.status != "d"
    RETURN entry
    `)
  return document;
};

/**
 * Get the value od a particular field of a document from a collection by primary Key
 * @param {Object} collection collection object that represents a collection in the DB
 * @param {String} key document primary key
 * @param {String} fieldName Name of the field to retrieve from the collection
 * @returns {Object} key, field name, field value
 */
var genericDocumentFieldByKeyGet = function (collection, key, fieldName) {
  const document = db._query(aql`
    FOR entry IN ${collection}
    FILTER entry._key == ${key}
      && entry.status != "d"
    RETURN { _key: entry._key, fieldName: ${fieldName}, fieldValue: entry.${fieldName}}
    `)
    //RETURN { _key: entry._key, ${fieldName}: entry.${fieldName}}
  return document;
};

/**
 * Instantiate a collection object
 * @params {String} collectionName Name of the collection that needs instantiation
 * @returns {Object} collection Object
 */
var genericCollectionObjectGet = function (collectionName) {
  const collection =  db._collection(collectionName);
  if (!collection) {
    throw httpError(HTTP_NOT_FOUND, "Collection not found");
  }
  return collection;
};

/**
 * Fully deletes a document from a collection  based on its primary key
 * @param {Object} collection Object representing the collection
 * @param {String} key Primary key of the object to be deleted
 */
var genericDocumentByKeyDelete = function (collection, key) {
  try {
    collection.remove(key);
  } catch (e)
  {
    if (e.isArangoError && e.errorNum === DOC_NOT_FOUND ) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
};

/**
 * Logically deletes a document from a collection  based on its primary key
 * @param {Object} collection Object representing the collection
 * @param {String} key Primary key of the object to be logically deleted
 */
var genericDocumentByKeyLogicallyDelete = function (collection, key) {
  try {
    var todayDate = new Date();
     collection.update(key, {"status": "d", "deleteDate": todayDate});
  } catch (e)
  {
    if (e.isArangoError && e.errorNum === DOC_NOT_FOUND ) {
      throw httpError(HTTP_NOT_FOUND, e.message);
    }
    throw e;
  }
}

//TODO: Remove loop since .save handles arrays since version 3.2
/**
 * Post documents into a collection in the DB
 * @param {Object} collection Object representing the collection
 * @param {[Object]} documents Array of documents to be posted
 * @returns {[Objects]} Posted documents
 */
var genericDocumentPost =  (collection, documents) => {
  const multiple = Array.isArray(documents);
  const arrayofDocuments = multiple ? documents : [documents];
  let postedDocuments = [];
  try {
     for (var document of arrayofDocuments) {
       const meta = collection.save(document);
       postedDocuments.push(Object.assign(document, meta));
     }
  }
  catch (e) {
    if (e.isArangoError && e.errorNum === DOC_DUPLICATE) {
      throw httpError(HTTP_CONFLICT, e.message);
    }
    throw e;
  }
  return postedDocuments;
};


//// TODO: modify put and patch to use the array functionality
var genericDocumentPut = (collection, key, document) => {
  let postedDocument;
  try {
    const meta = collection.replace(key, document);
    postedDocument = Object.assign(document,meta);
  }
    catch(e) {
      if (e.isArangoError && e.errorNum === DOC_NOT_FOUND) {
        throw httpError(HTTP_NOT_FOUND, e.message);
      }
      if (e.isArangoError && e.errorNum === DOC_CONFLICT) {
        throw httpError(HTTP_CONFLICT, e.message);
      }
      throw e;
    }
    return postedDocument
  };


var genericDocumentPatch = (collection, key, document) => {
  let patchedDocument;
  try {
    const meta = collection.update(key, document);
    patchedDocument = Object.assign(document, meta);
  }
    catch(e) {
      if (e.isArangoError && e.errorNum === DOC_NOT_FOUND) {
        throw httpError(HTTP_NOT_FOUND, e.message);
      }
      if (e.isArangoError && e.errorNum === DOC_CONFLICT) {
        throw httpError(HTTP_CONFLICT, e.message);
      }
      throw e;
    }
    return patchedDocument
  };


module.exports.genericCollectionGet = genericCollectionGet;
module.exports.genericDocumentByKeyGet = genericDocumentByKeyGet;
module.exports.genericDocumentFieldByKeyGet = genericDocumentFieldByKeyGet;
module.exports.genericCollectionObjectGet = genericCollectionObjectGet;
module.exports.genericDocumentByKeyDelete = genericDocumentByKeyDelete;
module.exports.genericDocumentByKeyLogicallyDelete = genericDocumentByKeyLogicallyDelete;
module.exports.genericDocumentPost = genericDocumentPost;
module.exports.genericDocumentPut = genericDocumentPut;
module.exports.genericDocumentPatch = genericDocumentPatch;
module.exports.genericMaxRecordsByQuery = g_MaxRecordsByQuery;
