'use strict';
const dd = require('dedent');
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;

module.exports = router;
var generic = module.context.dependencies.generic;

const keySchema = joi.string().required()
                  .description('The key of the document to be accessed');




//  UPDATE THESE

const Model = require('../models/invoice');
const ModelPatch = require('../models/invoicePatch');
const collection = generic.genericCollectionObjectGet('invoice');
const queriedb = require('../queries/invoice');

// ROUTES


// //TODO: Fix this so we can send arrays again
// router.post('/invoicePost',  (req, res) => {
//   const multiple = Array.isArray(req.body);
//   const documents = req.body
//
//   let documentsPosted = generic.genericDocumentPost(collection, documents);
//   res.send(multiple ? documentsPosted : documentsPosted[0]);
//
// })
// .body(Model, 'Entry or entries to store in the collection.')
// .response(Model, 'Entry or entries stored in the collection.')
// .summary('Store entry or entries')
// .description('Store a single entry or multiple entries in the collection.');
//
//
// router.put('/invoicePut/:key', (req, res) => {
//   const documentKey = req.pathParams.key;
//   const document =  req.body;
//
//   const documentPosted = generic.genericDocumentPut(collection, documentKey, document);
//   res.send(documentPosted);
// }, 'replace')
// .pathParam('key', keySchema)
// .body(Model, 'Document to replace entry in collection')
// .response(Model, 'Document stored in the collection.')
// .summary('Replace an existing document')
// .description(dd`
//       Replace an existing document in the collection
//       and returns the new document.
//       `);
//
//
// router.patch('/invoicePatch/:key', (req, res) => {
//   const documentKey = req.pathParams.key;
//   const document =  req.body;
//   const documentPatched = generic.genericDocumentPatch(collection, documentKey, document);
//   res.send(documentPatched);
// }, 'update')
// .pathParam('key', keySchema)
// .body(ModelPatch, 'Document to patch in collection')
// .response(ModelPatch, 'Document patched in the collection.')
// .summary('Patch an existing document')
// .description(dd`
//           Patch an existing document in the collection
//           and returns the updated document.
//           `);


router.get('/invoiceGet', function (req, res) {
  let dateFrom = new Date('2000-01-01');
  let dateThru = new Date('3000-12-31');
  if (req.queryParams.invoiceDate) {
    dateFrom = new Date(req.queryParams.invoiceDate);
    dateThru = new Date(req.queryParams.invoiceDate);
    dateThru.setDate(dateThru.getDate() + 1);
  };
  const documents =  queriedb.getInvoices(dateFrom, dateThru, req.queryParams._key, req.queryParams.customerName);
  res.send(documents);
},'list')
.response([Model], 'Documents retrieved from collection')
.queryParam('customerName', joi.string().description(dd`
              Name of the customer whose invoices are to be retrieved `))
.queryParam('invoiceDate', joi.string().description(dd`
             Date of the invoice
          `))
.queryParam('_key', joi.string().description(dd`
             invoice Primary Identifiyer
          `))
.summary('Retrieve collection documents')
.description(dd`
    Retrieve a set number of documents from the selected collection
    `);

router.get('/invoiceGet/:key', function (req, res) {
  let dateFrom = new Date('2000-01-01');
  let dateThru = new Date('3000-12-31');
  const documentKey = req.pathParams.key;
  const documents =  queriedb.getInvoices(dateFrom, dateThru, documentKey);
  res.send(documents);
},'detail')
.pathParam('key', keySchema)
.response(Model, 'Document retrieved from collection')
.summary('Retrieve a document')
.description(dd`
      Retrieve a document from the selected collection
      `);
