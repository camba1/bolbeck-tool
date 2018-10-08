'use strict';
const dd = require('dedent');
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;

//module.context.use(router);
module.exports = router;

const queriedb = require('../queries');
//const joiSchema = require('../schema');
const keySchema = joi.string().required()
                  .description('The key of the document to be modified');

var generic = module.context.dependencies.generic;


//  UPDATE THESE

const Model = require('../models/custKpiFormula');
const ModelPatch = require('../models/custKpiFormulaPatch');
const collection = generic.genericCollectionObjectGet('custKpiFormula');

//


// ROUTES

// router.get('hello-world's,function (req,res) {
//   res.send('Hello World');
// })
// .response(['text/plain'], 'A generic Greeting.')
// .summary('Generic Greeting')
// .description('Prints a generic Greeting.');

//TODO: Fix this so we can send arrays again
router.post('/custKpiFormulaPost',  (req, res) => {
   const multiple = Array.isArray(req.body);
  const documents = req.body

//let documentsPosted = queriedb.custKpiFormulaPost(collection, documents);
  let documentsPosted = generic.genericDocumentPost(collection, documents);
  res.send(multiple ? documentsPosted : documentsPosted[0]);

})
.body(Model, 'Entry or entries to store in the collection.')
.response(Model, 'Entry or entries stored in the collection.')
.summary('Store entry or entries')
.description('Store a single entry or multiple entries in the collection.');
/*.body(joi.alternatives().try(
  joiSchema.docSchema,
  joi.array().items(joiSchema.docSchema)
), 'Entry or entries to store in the collection.')
.response(joi.alternatives().try(
  joi.object().required(),
  joi.array().items(joi.object().required())
), 'Entry or entries stored in the collection.')
.summary('Store entry or entries')
.description('Store a single entry or multiple entries in the collection.');
*/




router.put('/custKpiFormulaPut/:key', (req, res) => {
  const documentKey = req.pathParams.key;
  const document =  req.body;

  //const documentPosted = queriedb.custKpiFormulaPut(collection, documentKey, document);
  const documentPosted = generic.genericDocumentPut(collection, documentKey, document);
  res.send(documentPosted);
}, 'replace')
.pathParam('key', keySchema)
.body(Model, 'Document to replace entry in collection')
.response(Model, 'Document stored in the collection.')
.summary('Replace an existing document')
.description(dd`
      Replace an existing document in the collection
      and returns the new document.
      `);





router.patch('/custKpiFormulaPatch/:key', (req, res) => {
  const documentKey = req.pathParams.key;
  const document =  req.body;
  const documentPatched = generic.genericDocumentPatch(collection, documentKey, document);
  res.send(documentPatched);
}, 'update')
.pathParam('key', keySchema)
.body(ModelPatch, 'Document to patch in collection')
.response(ModelPatch, 'Document patched in the collection.')
.summary('Patch an existing document')
.description(dd`
          Patch an existing document in the collection
          and returns the updated document.
          `);
