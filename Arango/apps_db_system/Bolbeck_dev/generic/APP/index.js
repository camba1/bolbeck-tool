'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;
const joiSchema = require('./schema');



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



router.post('/genericDocumentPost/:collectionName',  (req, res) => {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const multiple = Array.isArray(req.body);
  const documents = req.body

  let documentsPosted = queriedb.genericDocumentPost(collection, documents);
  res.send(multiple ? documentsPosted : documentsPosted[0]);

})
.body(joi.alternatives().try(
  joiSchema.docSchema,
  joi.array().items(joiSchema.docSchema)
), 'Entry or entries to store in the collection.')
.response(joi.alternatives().try(
  joi.object().required(),
  joi.array().items(joi.object().required())
), 'Entry or entries stored in the collection.')
.summary('Store entry or entries')
.description('Store a single entry or multiple entries in the collection.');



router.put('/genericDocumentPut/:collectionName/:key', (req, res) => {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  const document =  req.body;

  //const documentPosted = queriedb.custKpiFormulaPut(collection, documentKey, document);
  const documentPosted = queriedb.genericDocumentPut(collection, documentKey, document);
  res.send(documentPosted);
})
.pathParam('key', joi.string().required(), 'Key of document to be replaced')
.body(joiSchema.docSchema.required(), 'Document to replace entry in collection')
.response(joi.object().required(), 'Document stored in the collection.')
.summary('Replace an existing document')
.description('Replace an existing document in the collection.');


router.patch('/genericDocumentPatch/:collectionName/:key', (req, res) => {
  const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documentKey = req.pathParams.key;
  const document =  req.body;

  const documentPatched = queriedb.genericDocumentPatch(collection, documentKey, document);
  res.send(documentPatched);
})
.pathParam('key', joi.string().required(), 'Key of document to be patched')
.body(joiSchema.patchSchema.required(), 'Document to patch in collection')
.response(joi.object().required(), 'Document patched in the collection.')
.summary('Patch an existing document')
.description('Patch an existing document in the collection.');


module.exports.genericCollectionObjectGet = queriedb.genericCollectionObjectGet;
module.exports.genericCollectionGet = queriedb.genericCollectionGet;
module.exports.genericDocumentByKeyGet = queriedb.genericDocumentByKeyGet;
module.exports.genericDocumentFieldByKeyGet = queriedb.genericDocumentFieldByKeyGet;
module.exports.genericDocumentByKeyDelete = queriedb.genericDocumentByKeyDelete;
module.exports.genericDocumentByKeyLogicallyDelete = queriedb.genericDocumentByKeyLogicallyDelete;
module.exports.genericDocumentPost = queriedb.genericDocumentPost;
module.exports.genericDocumentPut = queriedb.genericDocumentPut;
module.exports.genericDocumentPatch = queriedb.genericDocumentPatch;
