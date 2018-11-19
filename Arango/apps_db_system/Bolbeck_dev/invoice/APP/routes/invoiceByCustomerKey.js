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

const Model = require('../models/invoiceByCustomerKey');
//const ModelPatch = require('../models/invoicePatch');
//const collection = generic.genericCollectionObjectGet('invoice');
const queriedb = require('../queries/invoiceByCustomerKey');

// ROUTES


//// TODO: Add date filtering
router.get('/invoiceByCustomerKeyGet/:customerKey', function (req, res) {
  let dateFrom = new Date('2000-01-01');
  let dateThru = new Date('3000-12-31');
  const customerKey = req.pathParams.customerKey;
  const documents =  queriedb.getInvoicesByCustomerKey(customerKey,
                                          dateFrom, dateThru,
                                          req.queryParams.includeProducts,
                                          req.queryParams.productKey);
  res.send(documents);
},'list')
.response([Model], 'Documents retrieved from collection')
.queryParam('invoiceDate', joi.string().description(dd`
             Date of the invoice
          `))
.queryParam('productKey', joi.string().description(dd`
             Indicates if the results should be for invoices
             with a specific product only
          `))
.queryParam('includeProducts', joi.boolean()
            .default(false, 'Will not return the products by default')
            .description(dd`
             Indicates if the api will return the products
             associated with the invoice
          `))
.summary('Retrieve collection documents')
.description(dd`
    Retrieve a set number of documents from the selected collection
    `);
