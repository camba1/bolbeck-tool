import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);
  //  this.graphNodesAndEdges = [],
    this.graphStyle = [
                  {
                    selector: 'node.invo',
                    style: {
                      'label': 'data(name)',
                      'background-color': '#7a45ae'
                      //'font-size': 10
                    }
                  },
                  {
                    selector: 'node.prod',
                    style: {
                      'label': 'data(key)',
                      //'font-size': 10
                      'background-color': '#6574cd'
                    }
                  },
                  {
                    selector: 'node.prodGroup',
                    style: {
                      'label': 'data(name)',
                      //'font-size': 10
                      'background-color': '#C3C3E5'
                    }
                  }
              ],
    this.graphLayout = {
                    name: 'cose'
                  }
  },
  selectedNode: undefined,
  graphGroupMode: 'none',
  nodesAndEdges: computed('model', function() {
    if (this.graphGroupMode == "none") {
      if (this.get('model')) {
        let model = this.get('model');
        let invCustNodes = getInvCustNodes(model)
        let prodNodesAndEdges = getProdNodesAndEdges(model)
        //this.set('graphNodesAndEdges', [...invCustNodes, ...prodNodesAndEdges])
        return [...invCustNodes, ...prodNodesAndEdges]
      }
    } else {
        return getGroupedInvProdNodesEdges(this)
    }

  }),
  actions: {
    /**
     * Controls actions bubbled up from the graph component and calls the functions
     * necessary to update the current page's side panel with the appropriate
     * product and product hierarchy information
     * @param {String} clickedItemKey key of the item the use cliked in the graph component
     * @param {String} clickType Indicates if the user clicked on'nodes' or 'edges'
     * @param {String} menuOptionName If the user clicked on a menu item rather than a node or edge,
     * this field which of the menu items was clicked.
     * @param {object} newData if the user clicked on the menu item to expand the graph with new data,
     * this field contains the values that were added to the graph
     */
    graphNodeClicked(clickedItemKey, clickType, clickItemType){//, menuOptionName, newData ) {
       // if (menuOptionName) {
       //   //menuOptionName == 'link' ? this.transitionToRoute('products.show.show-detail',clickedItemKey): ''
       //   switch(menuOptionName) {
       //       case 'link':
       //           this.transitionToRoute('products.show.show-detail',clickedItemKey)
       //           break;
       //       case 'afterexpand':
       //           this.expandedNodeData.push(...newData);
       //           break;
       //       default:
       //           throw 'Unknown menu option in the graph. Please contact support.'
       //   }
       // } else {
         clickType == 'nodes' ? populateNodeInfo(this, clickedItemKey, clickItemType) :
                               populateEdgeInfo(this, clickedItemKey, clickItemType)
       // }
    }
  }
});


function getProdNodesAndEdges(model){
  let edges = []
  let nodes = []
  let prodIds = []
  var invoiceId = ""
  let product = {}
  for  (let invoiceIdx in model) {
    invoiceId = model[invoiceIdx]._id
    for (let productIdx in model[invoiceIdx].products) {
      product = model[invoiceIdx].products[productIdx]
      if (typeof(product) == 'object') {
        //Add product edges
        edges.push({ group: "edges", data: {id: product.invoContains_id,
                                          source: invoiceId,
                                          target: product.product_id,
                                          key: product.invoContains_key,
                                          type: 'invoProd'
                                         }
                  })
        // Add unique product nodes
        if (!prodIds.includes(product.product_id)){
          prodIds.push(product.product_id)
          nodes.push({ group: "nodes",
                        data: {id: product.product_id,
                              name: product.product_key,
                              key: product.product_key,
                              type: 'prod'
                              },
                        classes: 'prod'

                      })
        }
      }
    }
  }
  return [...nodes, ...edges];
}

function getInvCustNodes(model){
  return model.map(a => {return { group: "nodes",
                                 data: { id: a._id,
                                        name: a._key,
                                        key: a.invoBillTo_key,
                                        type: 'invo'
                                        },
                                 classes: 'invo'

                                }
                          })
}


function getGroupedInvProdNodesEdges(thisController) {
  if (thisController.get('model')) {
    let model = thisController.get('model');


    let prodMap = new Map();
    var key = ""
    var newValue = ""
    var currInvoiceid = ""
    //Create map product -> Invoice(s)
    model.forEach( function(invoice) {
      if (invoice.products) {
        currInvoiceid = invoice._id
        invoice.products.forEach( function(product) {
          key = product.product_key
          if (prodMap.has(key)) {
            //make sure we do not add it twice
             let oldVal = prodMap.get(key).split(",")
             if (!oldVal.includes(currInvoiceid)) {
               newValue = prodMap.get(key) + "," + currInvoiceid
               prodMap.set(key, newValue )
             }
            //prodMap.get(key).push(currInvoiceid)
          } else {
            prodMap.set(key, currInvoiceid)
          }
        })
      }
    })
    //incert the mapping to group invoices that have product
    let invMap = new Map();
    for (var [oldKey, oldValue] of prodMap) {
      if (invMap.has(oldValue)){
        // newValue = invMap.get(oldValue).push(oldKey)
        // invMap.set(oldvalue, newValue)
        invMap.get(oldValue).push(oldKey)
      } else {
        invMap .set(oldValue, [oldKey])
      }
    }
    //return invMap
    //Build the object to use with graph
    let invNodes = getInvCustNodes(model);
    let productNodes = [];
    let invProdEdges = [];
    var i = 0;
    const group = "G"
    var currentGroupId = ""
    for (var [invoiceListString, productListArray] of invMap) {
        currentGroupId = `${group}${i}`;
        productNodes.push({ group: "nodes",
                      data: {id: currentGroupId,
                            name: `${productListArray.length} prds`,
                            key: currentGroupId,
                            type: 'prodGroup',
                            products: productListArray
                            },
                      classes: 'prodGroup'
                    })
        invoiceListString.split(",").map(invoiceId => {
          invProdEdges.push({ group: "edges", data: {id: `${currentGroupId}${invoiceId}`,
                                              source: invoiceId,
                                              target: currentGroupId,
                                              key: `${currentGroupId}${invoiceId}`,
                                              type: 'invoProd'
                                             }
                      })
        })
        i++;
    }
    let returnVal = [...invNodes, ...productNodes, ...invProdEdges]
    //thisController.set('graphNodesAndEdges', returnVal)
    return returnVal


  }
}

function populateNodeInfoFromGroup(thisController, clickedItemKey, clickItemType){
  let searchLevel = 0;
  let searchFieldName = "";
  let products = [];
  let clickedItem = [];
  searchFieldName = "key";
  let prodsReturn = [];

  thisController.nodesAndEdges.some( function(childModel) {
    if (childModel.group == "nodes" && childModel.data.key == clickedItemKey){
      products = childModel.data.products;
      return true
    }
    return false
  })
  if (products){
    searchLevel = 1;
    searchFieldName = 'product_key';
    let invoices = findItem(thisController.model, products[0], searchFieldName, searchLevel)
    clickedItem = invoices.map(a => {return {_key: a._key,
                                              invoiceDate: a.invoiceDate,
                                              totAmount: a.totAmount } });
    let foundProds = [];
    let index = 0;

    invoices.forEach( function(invoice){
      invoice.products.forEach(function(invProduct) {
        if (products.includes(invProduct.product_key)) {
          if (foundProds.includes(invProduct.product_key)) {
            index = foundProds.indexOf(invProduct.product_key);
            prodsReturn[index].quanty += invProduct.quanty;
            prodsReturn[index].totamount += invProduct.quanty * invProduct.unitPrice;
            prodsReturn[index].unitPrice = (prodsReturn[index].quanty !=0) ?
                            prodsReturn[index].totamount / prodsReturn[index].quanty : 0 ;
          } else {
            foundProds.push(invProduct.product_key)
            prodsReturn.push({ product_key: invProduct.product_key,
                                productName: invProduct.productName,
                                unitPrice: invProduct.unitPrice,
                                quanty: invProduct.quanty,
                                totamount: invProduct.quanty * invProduct.unitPrice
            })
          }
        }
      })
    })
  }

  if (clickedItem[0]) {clickedItem[0].products = prodsReturn};
  return clickedItem
}

/**
 * Searches for the information of a particular node record. Populates
 * the screen node pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up product information
 */
function populateNodeInfo(thisController, clickedItemKey, clickItemType) {
  let searchLevel = 0;
  let searchFieldName = "";
  let clickedItem = [];
  if (clickItemType == 'invo') {
    searchLevel = 0;
    searchFieldName = 'invoBillTo_key';
    clickedItem = findItem(thisController.model, clickedItemKey, searchFieldName, searchLevel)

  } else if (clickItemType == 'prod') {
    searchLevel = 1;
    searchFieldName = 'product_key';
    let parentItem = findItem(thisController.model, clickedItemKey, searchFieldName, searchLevel)
    searchLevel = 0;
    let dependentItem = parentItem[0] ? findItem(parentItem[0].products,
                                                  clickedItemKey,
                                                   'product_key', 0) : []

    clickedItem = parentItem.map(a => {return {_key: a._key,
                                              invoiceDate: a.invoiceDate,
                                              totAmount: a.totAmount } });

     clickedItem[0].products =  clickedItem[0] ? dependentItem : [];
  } else {
    clickedItem = populateNodeInfoFromGroup(thisController, clickedItemKey, clickItemType)
  }

  thisController.set("selectedNode", clickedItem) ;

}


/**
 * Searches the product model, the productHierarchy model and the expanded data for
 * a particular record
 * @param {object} thisController Page controller
 * @param {String} clickedItemKey Item we are looking for
 * @param {String} searchFieldName Name of the field in the datasources where to
 * look for the clickedItemKey
 * @returns {object} Item found or undefined
 */
function findItem(currentModel, clickedItemKey, searchFieldName, searchLevel,
                  isRecursion = false, childModelField = 'products') {
  let clickedItems;
  if (searchLevel <= 0) {
    clickedItems = currentModel.find((item) => { return item[searchFieldName]== clickedItemKey} ) ;
  } else {
    let modelsFound = [];
    currentModel.forEach( function(childModel) {
        let item = findItem(childModel[childModelField], clickedItemKey, searchFieldName,
                            searchLevel - 1, true, childModelField);
        if ( item ) {
          modelsFound.push(childModel);
        }
      });
      clickedItems = modelsFound
    }
    if (isRecursion == false && !Array.isArray(clickedItems)) {
      clickedItems = [clickedItems];
    }
  return clickedItems
}
/**
 * Searches for the information of a particular edge record and its parent. Populates
 * the screen Relationship pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up hierarchy information
 */
function populateEdgeInfo(thisController, clickedItemKey) { //, clickItemType) {
  let currentModel = thisController.model
  let parentItem = findItem(currentModel, clickedItemKey,'invoContains_key', 1 )
  let dependentItem = parentItem[0] ? findItem(parentItem[0].products,
                                                clickedItemKey,
                                                 'invoContains_key', 0) : []
  let clickedItem = parentItem.map(a =>
                                 {return {_key: a._key,
                                         invoiceDate: a.invoiceDate,
                                         totAmount: a.totAmount } });
  clickedItem[0].products =  clickedItem[0] ? dependentItem : [];
  thisController.set("selectedNode", clickedItem) ;
}
