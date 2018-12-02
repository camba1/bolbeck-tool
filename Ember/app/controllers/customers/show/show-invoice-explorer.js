import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  selectedNode: undefined,
  edges: computed('model', function() {
    if (this.get('model')) {
      let model = this.get('model');
      let invProdEdges = getInvProductEdges(model);
      // let invCustEdges = getInvCustEdges(model);
      // return [...invCustEdges,...invProdEdges];
      return invProdEdges;
    }
  }),
  nodes: computed('model', function() {
    if (this.get('model')) {
      let model = this.get('model');
      let invProdNodes = getInvProductNodes(model);
      let invCustNodes = getInvCustNodes(model);
      // let custNode = getCustNode(model);
      // return [...custNode,...invCustNodes,...invProdNodes];
       return [...invCustNodes,...invProdNodes];
    }
  }),
  graphStyle: [
                {
                  selector: 'node.invo',
                  style: {
                    'label': 'data(key)',
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
                }//,
                // {
                //   selector: 'node.cust',
                //   style: {
                //     'label': 'data(name)',
                //      'shape': 'diamond',
                //      'background-color': '#e74c3c'
                //   }
                // }//,
                //{
                  // selector: 'edge',
                  // style: {
                  //   'curve-style': 'bezier',
                  //   'opacity': 0.667,
                  //  'target-arrow-shape': 'triangle'
                  //}
              //  }
            ],
  graphLayout: {
                  name: 'cose'
                },
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

function getInvProductEdges(model){
  let result = []
  var invoiceId = ""
  let product = {}
  for  (let invoiceIdx in model) {
    invoiceId = model[invoiceIdx]._id
    for (let productIdx in model[invoiceIdx].products) {
      product = model[invoiceIdx].products[productIdx]
      if (typeof(product) == 'object') {
      result.push({ group: "edges", data: {id: product.invoContains_id,
                                          source: invoiceId,
                                          target: product.product_id,
                                          key: product.invoContains_key,
                                          type: 'invoProd'
                                         }
                  })
      }
    }
  }
  return result;
}

// function getInvCustEdges(model){
//   return model.map(a => {return { group: "edges", data: { id: a.invoBillTo_id,
//                                                   source: a.customer_id,
//                                                   target: a._id,
//                                                   key: a.invoBillTo_key
//                                                   }
//                                   }
//                           })
// }

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

function getInvProductNodes(model){
  let result = []
  let prodIds = []
  //var invoiceKey = ""
  let product = {}
  for  (let invoiceIdx in model) {
    //invoiceKey = model[invoiceIdx]._key
    for (let productIdx in model[invoiceIdx].products) {
      product = model[invoiceIdx].products[productIdx]
      if (typeof(product) == 'object' && !prodIds.includes(product.product_id)){
        prodIds.push(product.product_id)
        result.push({ group: "nodes",
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
  return result;
}

// function getCustNode(model){
//   let firstNode= [];
//   let firstItemInModel = model[0];
//   firstNode.push({ group: "nodes", data: { id: firstItemInModel.customer_id,
//                     name: firstItemInModel.customerName,
//                     key: firstItemInModel.customer_key,
//                   }, classes: 'cust' });
//   return firstNode;
// }

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

  } else {
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
  }

  thisController.set("selectedNode", clickedItem) ;


  // thisController.set("showHierarchyNodeCard", true);
  // thisController.set("showHierarchyEdgeCard", false)
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
function findItem(currentModel, clickedItemKey, searchFieldName, searchLevel, isRecursion = false) {
  let clickedItems;
  if (searchLevel <= 0) {
    clickedItems = currentModel.find((item) => { return item[searchFieldName]== clickedItemKey} ) ;
  } else {
    let modelsFound = [];
    currentModel.forEach( function(childModel) {
        let item = findItem(childModel.products, clickedItemKey, searchFieldName, searchLevel - 1, true);
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
function populateEdgeInfo(thisController, clickedItemKey, clickItemType) {
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
