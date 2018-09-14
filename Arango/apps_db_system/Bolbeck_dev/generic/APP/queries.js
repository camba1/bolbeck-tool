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

// Get a number of documents from a given collection
var genericCollectionGet = function (collection) {
  const documents = db._query(aql`
    FOR entry IN ${collection}
    FILTER entry.status != "d"
    LIMIT ${g_MaxRecordsByQuery}
    RETURN entry`
  );
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

var genericCollectionObjectGet = function (collectionName) {
  const collection =  db._collection(collectionName);
  if (!collection) {
    throw httpError(HTTP_NOT_FOUND, "Collection not found");
  }
  return collection;
};

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
