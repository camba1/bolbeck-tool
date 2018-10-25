import Controller, {  inject as controller }  from '@ember/controller';
import queryHierarchy from 'ember-gui/gql/queries/product/prodHierarchy';
import { computed } from '@ember/object';

export default Controller.extend({
  //Parent controller and model information to be used in the graph and
  // populating the page's side panels
  productController: controller('products/show'),
  productModel: computed('model', function(){
     return this.get('productController.model')
   }),

   //Graph component controlling properties
  bottonHierarchyLevel: 'sku',
  apolloHierarchyQueryId: 'prodHierarchy',
  expandedNodeData: [],
  //GUI controlling properties
  hierarchyQuery: queryHierarchy,
  hierarchyNode: undefined,
  hierarchyEdge: undefined,
  hierarchyEdgeParent: undefined,
  showHierarchyNodeCard: false,
  showHierarchyEdgeCard: false,

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
   graphNodeClicked(clickedItemKey, clickType, menuOptionName, newData ) {
      if (menuOptionName) {
        //menuOptionName == 'link' ? this.transitionToRoute('products.show.show-detail',clickedItemKey): ''
        switch(menuOptionName) {
            case 'link':
                this.transitionToRoute('products.show.show-detail',clickedItemKey)
                break;
            case 'afterexpand':
                this.expandedNodeData.push(...newData);
                break;
            default:
                throw 'Unknown menu option in the graph. Please contact support.'
        }
      } else {
        clickType == 'nodes' ? populateNodeInfo(this, clickedItemKey) :
                              populateEdgeInfo(this,clickedItemKey)
      }
   }
 }
});

/**
 * Searches for the information of a particular node record. Populates
 * the screen node pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up product information
 */
function populateNodeInfo(thisController, clickedItemKey) {
  let clickedItem = findItem(thisController, clickedItemKey, '_key')
  thisController.set("hierarchyNode", clickedItem) ;
  thisController.set("showHierarchyNodeCard", true);
  thisController.set("showHierarchyEdgeCard", false)
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
function findItem(thisController, clickedItemKey, searchFieldName) {
  let clickedItem
  if(clickedItemKey == thisController.productModel[0][searchFieldName]){//._key) {
    clickedItem = thisController.productModel[0];
  } else {
    clickedItem = thisController.model.find((product) => { return product[searchFieldName]== clickedItemKey} );
    if (!clickedItem) {
      clickedItem = thisController.expandedNodeData.find((product) => { return product[searchFieldName] == clickedItemKey} );
    }
  }
  return clickedItem
}
/**
 * Searches for the information of a particular edge record and its parent. Populates
 * the screen Relationship pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up hierarchy information
 */
function populateEdgeInfo(thisController, clickedItemKey) {
  let clickedItem = findItem(thisController, clickedItemKey, 'e_key')
  let parentItem = findItem(thisController, clickedItem.eFrom, '_id')
  thisController.set("hierarchyEdgeParent", parentItem);
  thisController.set("hierarchyEdge", clickedItem) ;
  thisController.set("showHierarchyNodeCard", false);
  thisController.set("showHierarchyEdgeCard", true)
}
