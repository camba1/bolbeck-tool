const db = require('@arangodb').db;
const aql = require('@arangodb').aql;
const invalidDatesMsg = 'Invalid dates: '
const invalidKeysMsg = 'Either the invoice or the customer key must be provided'
var generic = module.context.dependencies.generic;

//// TODO: Add date filtering
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
      productsInFinalReturn = ' ,prods : prods ';
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
        invoVillTo_key:pathToBillTos.vertices[0]._key,
        totAmount: round(sum(prods[*].amount)*100)/100,
        customer_key: pathToBillTos.vertices[0]._key,
        customer_id: pathToBillTos.vertices[0]._id,
        customerName: pathToBillTos.vertices[0].name
        ${productsInFinalReturn}
        }
    `
    let documents = db._query(query, aqlParams)
    return documents;
}

//// TODO: Fix date filtering
var getInvoices = function(dateFrom, dateThru, invoice_key, customerName){

  if (!(dateFrom instanceof Date) || !(dateThru instanceof Date)){
    throw invalidDatesMsg.concat(dateFrom, ", ",dateThru)
  }

  let customFilter = "";
  let customCustomerFilter = "";
  var aqlParams = { };

  aqlParams.dateFrom = dateFrom.toLocaleDateString();
  aqlParams.dateThru = dateThru.toLocaleDateString();


  if (invoice_key){
    customFilter =  ` AND inv._key == @invoice_key LIMIT ${generic.genericMaxRecordsByQuery} `
    aqlParams.invoice_key = invoice_key
  } else if (customerName) {
    customCustomerFilter = ` FILTER invoices.name == @customerName LIMIT ${generic.genericMaxRecordsByQuery} `
    aqlParams.customerName = customerName
  } else {
    customFilter = `LIMIT ${generic.genericMaxRecordsByQuery}`
  }

  var query = `FOR inv in invoice
                FILTER inv.invoiceDate < @dateThru
                AND inv.invoiceDate >= @dateFrom
                ${customFilter}
                FOR invoices,invoBillTos,pathToBillTos in OUTBOUND inv
                invoBillTo
                ${customCustomerFilter}
                LET prods = ( for products,e in outbound invoBillTos._from
                                invoContains
                                return {
                                        amount: round((e.unitPrice * e.quantity)*100)/100
                                        }
                            )
                RETURN {
                  _key: pathToBillTos.vertices[0]._key,
                  _id: pathToBillTos.vertices[0]._id,
                  invoiceDate: pathToBillTos.vertices[0].invoiceDate,
                  customer_key: invoices._key,
                  customer_id: invoices._id,
                  customerName: invoices.name,
                  invoVillTo_key:pathToBillTos.vertices[0]._key,
                  totAmount: round(sum(prods[*].amount)*100)/100
                }`

  let documents = db._query(query, aqlParams)
  return documents;
}


module.exports.getInvoices = getInvoices;
module.exports.getInvoicesByCustomerKey = getInvoicesByCustomerKey;
// for v,e,p in 1..2 INBOUND 'customer/microbilt-corporation'
// invoBillTo, OUTBOUND invoContains
// //filter p.edges[0]._from  == 'invoice/541280'
// collect customerName = p.vertices[0].name,
//         customer_Key = p.vertices[0]._key,
//         key = p.vertices[1]._key,
//         invoiceDate = p.vertices[1].invoiceDate,
//         productName = p.vertices[2].name,
//         product_key = p.vertices[2]._key,
//         quantity = p.edges[1].quantity,
//         unitPrice = p.edges[1].unitPrice
// filter productName != null
// return {
//         customerName: customerName,
//         customer_Key: customer_Key,
//         _key: key ,
//         invoiceDate: invoiceDate,
//         productName: productName,
//         product_key:product_key ,
//         quantity: quantity,
//         unitPrice:  unitPrice,
//         amount: round((unitPrice * quantity)*100)/100
// }
