import Controller from '@ember/controller';
import { computed } from '@ember/object';
import format from 'date-fns/format'

// #region IconSvgs

let linkIcon = '<svg id="bolbeckLink" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-icon="link" data-prefix="fas" class="svg-inline--fa fa-link fa-w-16  ember-view"><path fill="currentColor" d="M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"></path></svg>'
let minusIcon = '<svg id="bolbeckMinus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-icon="minus-square" data-prefix="fas" class="svg-inline--fa fa-minus-square fa-w-14  ember-view"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM92 296c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h264c6.6 0 12 5.4 12 12v56c0 6.6-5.4 12-12 12H92z"></path></svg>'
let plusIcon = '<svg id="bolbeckPlus" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-icon="plus-square" data-prefix="fas" class="svg-inline--fa fa-plus-square fa-w-14  ember-view"><path fill="currentColor" d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-32 252c0 6.6-5.4 12-12 12h-92v92c0 6.6-5.4 12-12 12h-56c-6.6 0-12-5.4-12-12v-92H92c-6.6 0-12-5.4-12-12v-56c0-6.6 5.4-12 12-12h92v-92c0-6.6 5.4-12 12-12h56c6.6 0 12 5.4 12 12v92h92c6.6 0 12 5.4 12 12v56z"></path></svg>'
let hLightIcon = '<svg id="bolbeckLight" viewBox="0 0 352 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-icon="lightbulb" data-prefix="fas" class="svg-inline--fa fa-lightbulb fa-w-11  ember-view"><path fill="currentColor" d="M96.06 454.35c.01 6.29 1.87 12.45 5.36 17.69l17.09 25.69a31.99 31.99 0 0 0 26.64 14.28h61.71a31.99 31.99 0 0 0 26.64-14.28l17.09-25.69a31.989 31.989 0 0 0 5.36-17.69l.04-38.35H96.01l.05 38.35zM0 176c0 44.37 16.45 84.85 43.56 115.78 16.52 18.85 42.36 58.23 52.21 91.45.04.26.07.52.11.78h160.24c.04-.26.07-.51.11-.78 9.85-33.22 35.69-72.6 52.21-91.45C335.55 260.85 352 220.37 352 176 352 78.61 272.91-.3 175.45 0 73.44.31 0 82.97 0 176zm176-80c-44.11 0-80 35.89-80 80 0 8.84-7.16 16-16 16s-16-7.16-16-16c0-61.76 50.24-112 112-112 8.84 0 16 7.16 16 16s-7.16 16-16 16z"></path></svg>'
let expandIcon = '<svg id="bolbeckExpand" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" data-icon="expand-arrows-alt" data-prefix="fas" class="svg-inline--fa fa-expand-arrows-alt fa-w-14  ember-view"><path fill="currentColor" d="M448.1 344v112c0 13.3-10.7 24-24 24h-112c-21.4 0-32.1-25.9-17-41l36.2-36.2L224 295.6 116.8 402.9 153 439c15.1 15.1 4.4 41-17 41H24c-13.3 0-24-10.7-24-24V344c0-21.4 25.9-32.1 41-17l36.2 36.2L184.5 256 77.2 148.7 41 185c-15.1 15.1-41 4.4-41-17V56c0-13.3 10.7-24 24-24h112c21.4 0 32.1 25.9 17 41l-36.2 36.2L224 216.4l107.3-107.3L295.1 73c-15.1-15.1-4.4-41 17-41h112c13.3 0 24 10.7 24 24v112c0 21.4-25.9 32.1-41 17l-36.2-36.2L263.6 256l107.3 107.3 36.2-36.2c15.1-15.2 41-4.5 41 16.9z"></path></svg>'

// #endregion

export default Controller.extend({

// #region Gui controlling properties
  hideSideCards: false,
  sideCardsClass: computed("hideSideCards", function() {
    return this.hideSideCards ? "col-md-4 d-none" : "col-md-4"
  }),
  graphColClass: computed("hideSideCards", function() {
    return this.hideSideCards ? "col-md" : "col-md-8"
  }),
// #endregion

  init() {
    this._super(...arguments);

// #region graph style & layout
    this.graphStyle = [
                  {
                    selector: 'node.invo',
                    style: {
                      // 'label': 'data(name)',
                      "width": "mapData(prodCount, 0, 50, 20, 35)",
                      "height": "mapData(prodCount, 0, 50, 20, 35)",
                      'min-zoomed-font-size': 10,
                      'background-color': '#7a45ae'
                      //'font-size': 10
                    }
                  },
                  {
                    selector: 'node.invoLblNm',
                    style: {
                      'label': 'data(name)'
                    }
                  },
                  {
                    selector: 'node.invoLblDt',
                    style: {
                      'label': 'data(idate)'
                    }
                  },
                  {
                    selector: 'node.ireturn',
                    style: {
                      'shape': 'square'
                    }
                  },
                  {
                    selector: 'node.prod',
                    style: {
                      'label': 'data(key)',
                      'min-zoomed-font-size': 10,
                      'font-size': 10,
                      'background-color': '#6574cd'
                    }
                  },
                  {
                    selector: 'node.prodGroup',
                    style: {
                      'label': 'data(name)',
                      "width": "mapData(products.length, 0, 20, 10, 25)",
                      "height": "mapData(products.length, 0, 20, 10, 25)",
                      'min-zoomed-font-size': 10,
                      'background-color': '#C3C3E5'
                    }
                  },
                  {
                    selector: "node:selected",
                    style: {
                      "background-color": "#7ABA7A",
                    }
                  },
                  {
                    selector: "node.prod[[degree < 2]]",
                    style: {
                      "width": "10",
                      "height": "10",
                    }
                  },
                  {
                    selector: "node.prod[[degree >= 2]][[degree < 5]]",
                    style: {
                      "width": "15",
                      "height": "15",
                    }
                  },
                  {
                    selector: "node.prod[[degree > 5]]",
                    style: {
                      "width": "20",
                      "height": "20",
                    }
                  },
                  {
                    selector: "edge",
                    style: {
                      "line-color": "#CCCCCC"
                    }
                  },
                  {
                    selector: "edge:selected",
                    style: {
                      "line-color": "#7ABA7A",
                    }
                  }
              ],
    this.graphMenuOptions = [
          {menuSelector:"node.prodGroup",
           menuItems: [ {content:`${expandIcon}`,
                        dataReturnField: "id",
                        menuItemId: "expand"},
                        {content:`${minusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hide"},
                        {content:`${plusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "show"},
                        {content:`${hLightIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hLight"}
                        ] },
          {menuSelector:"node.invo",
           menuItems: [ {content:`${linkIcon}`,
                        dataReturnField: "id",
                        menuItemId: "link"},
                        {content:`${minusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hide"},
                        {content:`${plusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "show"},
                        {content:`${hLightIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hLight"}
                          ] },
          {menuSelector:"node.prod",
           menuItems: [ {content:`${linkIcon}`,
                        dataReturnField: "id",
                        menuItemId: "link"},
                        {content:`${minusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hide"},
                        {content:`${plusIcon}`,
                        dataReturnField: "id",
                        menuItemId: "show"},
                        {content:`${hLightIcon}`,
                        dataReturnField: "id",
                        menuItemId: "hLight"}
                        ] }
          ],
//#endregion
    this.graphLabelOptions = [{   id: "InvoLbl",
                                  label: "Invoice Label",
                                  options: [
                                    {
                                      label: "Invoice Number",
                                      value: "InvoLbl.invoLblNm.invoLblDt"
                                    },
                                    {
                                      label: "Invoice Date",
                                      value: "InvoLbl.invoLblDt.invoLblNm"
                                    }
                                  ]
                              }],
    this.graphLayout = {
                          name: 'cose'
                        }
  },
  selectedNode: undefined,
  selectedNodeProdCount: undefined,
  nodesExpansion: undefined,
  graphGroupMode: 'none',
  nodesAndEdges: computed('model','graphGroupMode', function() {
    // this.set('selectedNode', undefined);
    // this.set('selectedNodeProdCount', undefined);
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
         clickType == 'nodes' ? populateNodeInfo(this, clickedItemKey, clickItemType) :
                               populateEdgeInfo(this, clickedItemKey, clickItemType)
    },
    graphMenuClicked(clickedItemKey, clickType, clickItemType, menuOptionName ) {
      let expansionNodes
      let key = clickedItemKey.substring(clickedItemKey.indexOf('/')+1);
      let mainObject = (clickItemType == 'prod') ? 'products' : 'invoices'
       switch(menuOptionName) {
           case 'link':
               this.transitionToRoute(`${mainObject}.show.show-detail`,key)
               break;
           case 'expand':
               expansionNodes = populateNodeExpansion(this, clickedItemKey)
               this.set('nodesExpansion',expansionNodes)
               break;
           default:
               throw 'Unknown menu option in the graph. Please contact support.'
       }
    },
    graphExpandClicked(){
      this.set('hideSideCards', !this.hideSideCards);
    },
    postGraphReloadData(){
      this.set('selectedNode', undefined);
      this.set('selectedNodeProdCount', undefined);
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
  return model.map(a => {
                        let returnInvoice = (a.totAmount < 0) ? "ireturn" : "";
                        return { group: "nodes",
                                 data: { id: a._id,
                                        name: a._key,
                                        key: a.invoBillTo_key,
                                        type: 'invo',
                                        idate: format( new Date(a.invoiceDate), 'MM/DD/YY'),
                                        prodCount: a.products.length,
                                        },
                                 classes: `invo invoLblNm ${returnInvoice}`

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
                                              key: `${currentGroupId}_${invoiceId}`,
                                              type: 'invoProdGrp'
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

function populateNodeInfoFromGroup(thisController, clickedItemKey, populatedInvoice = undefined){ //}, clickItemType){
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
    let invoices
    if (populatedInvoice) {
      invoices = populatedInvoice
    } else {
      searchLevel = 1;
      searchFieldName = 'product_key';
      invoices = findItem(thisController.model, products[0], searchFieldName, searchLevel)
    }

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
                                product_id: invProduct.product_id,
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

  if (clickedItem[0]) {clickedItem[0].products = prodsReturn}
  return clickedItem
}

/**
 * Searches for the information of a particular node record. Populates
 * the screen node pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up product information
 */
function populateNodeInfo(thisController, clickedItemKey, clickItemType) {
  // let prodCount = undefined;
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
    clickedItem = populateNodeInfoFromGroup(thisController, clickedItemKey);
  }

  thisController.set("selectedNode", clickedItem) ;
  thisController.set("selectedNodeProdCount", clickedItem[0] ? clickedItem[0].products.length : undefined ) ;

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
function populateEdgeInfo(thisController, clickedItemKey, clickItemType) {
  let parentItem
  let clickedItem
  let key = ""
  let currentModel = thisController.model
  if (clickItemType == 'invoProdGrp') {
    let prodKey = clickedItemKey.substring(0, clickedItemKey.indexOf('_'));
    key = clickedItemKey.substring(clickedItemKey.indexOf('/')+1);
    parentItem = findItem(currentModel, key,'_key', 0 )
    clickedItem = populateNodeInfoFromGroup(thisController, prodKey, parentItem);
  } else {
    parentItem = findItem(currentModel, clickedItemKey,'invoContains_key', 1 )


    let dependentItem = parentItem[0] ? findItem(parentItem[0].products,
                                                  clickedItemKey,
                                                   'invoContains_key', 0) : []
    clickedItem = parentItem.map(a =>
                                   {return {_key: a._key,
                                           invoiceDate: a.invoiceDate,
                                           totAmount: a.totAmount } });
    if (clickedItem[0]) {
      clickedItem[0].products =  dependentItem;
    }

  }
  thisController.set("selectedNode", clickedItem) ;
  thisController.set("selectedNodeProdCount", clickedItem[0] ? clickedItem[0].products.length : undefined ) ;
}


function populateNodeExpansion(thisController, clickedItemKey){
  let groupId = clickedItemKey
  let prodIds = []
  let nodes = []
  let edges = []
  let returnVal = undefined
  let relatedInvoices = populateNodeInfoFromGroup(thisController, groupId)
  if (relatedInvoices[0]){
    let products = relatedInvoices[0].products

    products.forEach( function(product) {
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
        edges.push({ group: "edges", data: {id: `${groupId}${product.product_id}`,
                                          source: groupId,
                                          target: product.product_id,
                                          key: `${groupId}_${product.product_id}`,
                                          type: 'prodProdGrp'
                                         }
                  })
      }
    })
    returnVal = [...nodes, ...edges]
  }
  return returnVal
}
