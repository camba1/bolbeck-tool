'use strict';
const dd = require('dedent');
const createRouter = require('@arangodb/foxx/router');
const router = createRouter();
const joi = require('joi');
const db = require('@arangodb').db;

module.exports = router;

const queriedb = require('../queries/prodHierarchy');

const keySchema = joi.string().required()
                  .description('The key of the document to be accessed');

var generic = module.context.dependencies.generic;


//  UPDATE THESE

const Model = require('../models/product');
const ModelPatch = require('../models/productPatch');
const collection = generic.genericCollectionObjectGet('product');

//

// ROUTES

// router.get('hello-world's,function (req,res) {
//   res.send('Hello World');
// })
// .response(['text/plain'], 'A generic Greeting.')
// .summary('Generic Greeting')
// .description('Prints a generic Greeting.');

//TODO: Fix this so we can send arrays again
router.post('/productPost',  (req, res) => {
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


router.put('/productPut/:key', (req, res) => {
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


router.patch('/productPatch/:key', (req, res) => {
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

const ModelProductHierarchy = require('../models/productHierarchy');

router.get('/productGet/:key/productHierarchyGet', (req, res) => {
  const documentKey = req.pathParams.key;
  const collectionHierarchy = generic.genericCollectionObjectGet('prodParentOf');
  const vf = new Date('2000-01-01');
  const vt = new Date('3000-12-31');
  const maxTraversalDepth = req.queryParams.maxDepth ? req.queryParams.maxDepth : 1;
  const traversaldirection = req.queryParams.direction
  const documentHierachy = queriedb.traverseEdgeCollectionWithValidDates(documentKey,
                          'product', collectionHierarchy, maxTraversalDepth,
                          vf, vt, traversaldirection)
  res.send(documentHierachy);
}, 'listHierarchy')
.pathParam('key', keySchema)
.queryParam('direction', joi.string().lowercase().valid('inbound', 'outbound', 'any').required().description(dd`
            Direction of traversal from given product (inbound/outbound/any)
`))
.queryParam('maxDepth', joi.number().integer().description(dd`
             Maximum number of levels to traverse
             Defaults to 1 if not specified
          `))
.response(ModelProductHierarchy, 'Hierarchy for given product')
.summary('Retrieve the hierarchy for product')
.description(dd`
          Retrieve the hierarchy for the given product document.
          Data can be searched outbound (children) or inbound (parents)
          `);
