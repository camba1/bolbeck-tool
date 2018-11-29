const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const invalidDatesMsg = 'Invalid dates: '
const invalidKeysMsg = 'Either the invoice or the customer key must be provided'
var generic = module.context.dependencies.generic;

//// TODO: Add date filtering
/**
 * Gets invoices for a given customer primary key.
 * @param {String} customer_key Customer Primary key
 * @param {Date} dateFrom Bounds the time frame for which the invoices will be fetched
 * @param {Date} dateThru Bounds the time frame for which the invoices will be fetched
 * @param {Boolean} includeProducts Indicates if the query should also return the products for each invoice
 * @param {String} product_key Product Primary Key. If present, return invoices containing this product only
 * @returns {[Object]} Returns list of invoices for customer and optionaly their products
 */
var getInvoicesByCustomerKey = function(customer_key,
                                            dateFrom, dateThru,
                                            includeProducts = false,
                                            product_key = undefined){
  let filterProductKey = "";
  let filterProductKey2 = "";
  let productFields = "";
  let productsInFinalReturn="";
  let customer_id = `customer/${customer_key}`
  var aqlParams = { };
  aqlParams.customer_id = customer_id
  //
  // if (!(dateFrom instanceof Date) || !(dateThru instanceof Date)){
  //   throw invalidDatesMsg.concat(dateFrom, ", ",dateThru)
  // }

   if (includeProducts) {
     productFields = ` product_key: products._key,
                       product_id: products._id,
                       productName: products.name,
                       invoContains_key: e._key,
                       dateAdded: e.dateAdded,
                       unitPrice: e.unitPrice,
                       quanty: e.quantity, `;
      productsInFinalReturn = ' ,products : prods ';
   }

   if (product_key) {
     filterProductKey = ' filter products._key == @product_key '
     filterProductKey2 = ' filter length(prods) > 0 '
     aqlParams.product_key = product_key
   }
   //filter products._key == '1124664'  (put inside prods query)
   //filter length(prods) > 0 (puton top of final return)
  var query = `
        for invoices,invoBillTos,pathToBillTos in INBOUND @customer_id
        invoBillTo
        LET prods = ( for products,e in outbound invoBillTos._from
                        invoContains
                        ${filterProductKey}
                        return {
                                        ${productFields}
                                        amount: round((e.unitPrice * e.quantity)*100)/100
                                }
                    )
        ${filterProductKey2}
        return {_key: invoices._key,
        _id: invoices._id,
        invoiceDate: invoices.invoiceDate,
        invoBillTo_key:invoBillTos._key,
        invoBillTo_id:invoBillTos._id,
        totAmount: round(sum(prods[*].amount)*100)/100,
        customer_key: pathToBillTos.vertices[0]._key,
        customer_id: pathToBillTos.vertices[0]._id,
        customerName: pathToBillTos.vertices[0].name,
        numberOfProds: length(prods)
        ${productsInFinalReturn}
        }
    `
    let documents = db._query(query, aqlParams)
    return documents;
}

module.exports.getInvoicesByCustomerKey = getInvoicesByCustomerKey;
