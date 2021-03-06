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

const Model = require('../models/customer');
const ModelPatch = require('../models/customerPatch');
const collection = generic.genericCollectionObjectGet('customer');

// const queriedb = require('../queries/prodHierarchy');
// const ModelcustomerHierarchy = require('../models/prodHierarchy');

//

// ROUTES


//TODO: Fix this so we can send arrays again
router.post('/customerPost',  (req, res) => {
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


router.put('/customerPut/:key', (req, res) => {
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


router.patch('/customerPatch/:key', (req, res) => {
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


//router.get('/customerGet/:collectionName', function (req, res) {
router.get('/customerGet', function (req, res) {
  //const collection = queriedb.genericCollectionObjectGet(req.pathParams.collectionName);
  const documents =  generic.genericCollectionGet(collection,req.queryParams );
  res.send(documents);
},'list')
//.pathParam('collectionName', collectionNameSchema)
.response([Model], 'Documents retrieved from collection')
.queryParam('name', joi.string().description(dd`
              Name of the customer to retrieve `))
.queryParam('state', joi.string().description(dd`
             State where the customer is located
          `))
.queryParam('city', joi.string().description(dd`
             City where the customer is located
          `))
.queryParam('_key', joi.string().description(dd`
             Customer Primary Identifiyer
          `))
.summary('Retrieve collection documents')
.description(dd`
    Retrieve a set number of documents from the selected collection
    `);

// router.get('/customerGet/:key/prodHierarchyGet', (req, res) => {
//   const documentKey = req.pathParams.key;
//   const collectionHierarchy = generic.genericCollectionObjectGet('prodParentOf');
//   const vf = new Date('2000-01-01');
//   const vt = new Date('3000-12-31');
//   const maxTraversalDepth = req.queryParams.maxDepth ? req.queryParams.maxDepth : 1;
//   const traversaldirection = req.queryParams.direction
//   const documentHierachy = queriedb.traverseEdgeCollectionWithValidDates(documentKey,
//                           'customer', collectionHierarchy, maxTraversalDepth,
//                           vf, vt, traversaldirection)
//   res.send(documentHierachy);
// }, 'listHierarchy')
// .pathParam('key', keySchema)
// .queryParam('direction', joi.string().lowercase().valid('inbound', 'outbound', 'any').required().description(dd`
//             Direction of traversal from given customer (inbound/outbound/any)
// `))
// .queryParam('maxDepth', joi.number().integer().description(dd`
//              Maximum number of levels to traverse
//              Defaults to 1 if not specified
//           `))
// .response(ModelcustomerHierarchy, 'Hierarchy for given customer')
// .summary('Retrieve the hierarchy for customer')
// .description(dd`
//           Retrieve the hierarchy for the given customer document.
//           Data can be searched outbound (children) or inbound (parents)
//           `);
