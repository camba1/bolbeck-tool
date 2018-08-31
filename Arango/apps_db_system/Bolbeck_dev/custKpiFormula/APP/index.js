'use strict';
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;

module.context.use(router);

const queriedb = require('./queries');
const joiSchema = require('./schema');

var generic = module.context.dependencies.generic;

//const collection = queriedb.genericCollectionObjectGet('custKpiFormula');
const collection = generic.genericCollectionObjectGet('custKpiFormula');
// ROUTES

// router.get('hello-world's,function (req,res) {
//   res.send('Hello World');
// })
// .response(['text/plain'], 'A generic Greeting.')
// .summary('Generic Greeting')
// .description('Prints a generic Greeting.');


router.post('/custKpiFormulaPost',  (req, res) => {
   const multiple = Array.isArray(req.body);
  const documents = req.body

//let documentsPosted = queriedb.custKpiFormulaPost(collection, documents);
  let documentsPosted = generic.genericDocumentPost(collection, documents);
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


router.put('/custKpiFormulaPut/:key', (req, res) => {
  const documentKey = req.pathParams.key;
  const document =  req.body;

  //const documentPosted = queriedb.custKpiFormulaPut(collection, documentKey, document);
  const documentPosted = generic.genericDocumentPut(collection, documentKey, document);
  res.send(documentPosted);
})
.pathParam('key', joi.string().required(), 'Key of document to be replaced')
.body(joiSchema.docSchema.required(), 'Document to replace entry in collection')
.response(joi.object().required(), 'Document stored in the collection.')
.summary('Replace an existing document')
.description('Replace an existing document in the collection.');


router.patch('/custKpiFormulaPatch/:key', (req, res) => {
  const documentKey = req.pathParams.key;
  const document =  req.body;

//const documentPatched = queriedb.custKpiFormulaPatch(collection, documentKey, document);
  const documentPatched = generic.genericDocumentPatch(collection, documentKey, document);
  res.send(documentPatched);
})
.pathParam('key', joi.string().required(), 'Key of document to be patched')
.body(joiSchema.patchSchema.required(), 'Document to patch in collection')
.response(joi.object().required(), 'Document patched in the collection.')
.summary('Patch an existing document')
.description('Patch an existing document in the collection.');
