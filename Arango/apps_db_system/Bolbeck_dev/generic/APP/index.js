'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;



module.context.use(router);

//const emptyJson = {};
const queriedb = require('./queries');


// ROUTES


router.get('/genericCollectionGet/:collectionName', function (req, res) {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documents =  queriedb.genericCollectionGet(collection);
  res.send(documents);
})
.pathParam('collectionName', joi.string().required(), 'Collection to be queried')
.response(joi.object().required(), 'Documents retrieved from collection')
.summary('Retrieve collection documents')
.description('Retrieve a set number of documents from the selected collection');


router.get('/genericDocumentByKeyGet/:collectionName/:key', function (req, res) {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  const document =  queriedb.genericDocumentByKeyGet(collection, documentKey);
  res.send(document);
})
.pathParam('collectionName', joi.string().required(), 'Collection to be queried')
.pathParam('key', joi.string().required(), 'Key of document to be retrieved')
.response(joi.object().required(), 'Document retrieved from collection')
.summary('Retrieve a document')
.description('Retrieve a document from the selected collection');


router.get('/genericDocumentFieldByKeyGet/:collectionName/:key/:fieldName', function (req,res) {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  const documentFieldName = req.pathParams.fieldName;
  const document = queriedb.genericDocumentFieldByKeyGet(collection, documentKey, documentFieldName);
  res.send(document);
})
.pathParam('collectionName', joi.string().required(), 'Collection to be queried')
.pathParam('key', joi.string().required(), 'Key of document to be retrieved')
.pathParam('fieldName', joi.string().required(), 'Name of the field to retrieve from the document ')
.response(joi.object().required(), 'Key and field value pair')
.summary('Retrieve the value of a field')
.description('Retrieve the value of a field in a document from the selected collection');



router.delete('/genericDocumentByKeyDeleteFull/:collectionName/:key', function (req, res) {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  queriedb.genericDocumentByKeyDelete(collection, documentKey);
})
.pathParam('collectionName', joi.string().required(), 'Collection to be queried')
.pathParam('key', joi.string().required(), 'Key of document to be deleted')
.response(null, 'Response only if there is an error')
.summary('Delete a document by key')
.description('Delete a document by key from a given collection')


router.delete('/genericDocumentByKeyDeleteLogical/:collectionName/:key', function (req, res) {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  queriedb.genericDocumentByKeyLogicallyDelete(collection, documentKey);
})
.pathParam('collectionName', joi.string().required(), 'Collection to be queried')
.pathParam('key', joi.string().required(), 'Key of document to be logically deleted')
.response(null, 'Response only if there is an error')
.summary('Logically delete a document by key')
.description('Logically delete a document by key from a given collection')


module.exports.genericCollectionObjectGet = queriedb.genericCollectionObjectGet;
module.exports.genericCollectionGet = queriedb.genericCollectionGet;
module.exports.genericDocumentByKeyGet = queriedb.genericDocumentByKeyGet;
module.exports.genericDocumentFieldByKeyGet = queriedb.genericDocumentFieldByKeyGet;
module.exports.genericDocumentByKeyDelete = queriedb.genericDocumentByKeyDelete;
module.exports.genericDocumentByKeyLogicallyDelete = queriedb.genericDocumentByKeyLogicallyDelete;
module.exports.genericDocumentPost = queriedb.genericDocumentPost;
module.exports.genericDocumentPut = queriedb.genericDocumentPut;
module.exports.genericDocumentPatch = queriedb.genericDocumentPatch;
