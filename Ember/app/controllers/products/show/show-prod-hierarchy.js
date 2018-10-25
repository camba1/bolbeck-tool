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
        menuOptionName == 'link' ? this.transitionToRoute('products.show.show-detail',clickedItemKey): ''
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
  let clickedItem
  clickedItem = clickedItemKey == thisController.productModel[0]._key ?
     thisController.productModel[0] :
     thisController.model.find((product) => { return product._key == clickedItemKey} );
  thisController.set("hierarchyNode", clickedItem) ;
  thisController.set("showHierarchyNodeCard", true);
  thisController.set("showHierarchyEdgeCard", false)
}

/**
 * Searches for the information of a particular edge record and its parent. Populates
 * the screen Relationship pane with the information obtained
 * @param {object} thisController Controller of the page used to get the product hierarhcy model
 * @param {String} clickedItemKey Key of the item for which we need to look up hierarchy information
 */
function populateEdgeInfo(thisController, clickedItemKey) {
  let clickedItem = thisController.model.find((product) => { return product.e_key == clickedItemKey} );
  let parentItem = clickedItem.eFrom == thisController.productModel[0]._id ?
     thisController.productModel[0] :
     thisController.model.find((product) => { return product._id == clickedItem.eFrom} );
  thisController.set("hierarchyEdgeParent", parentItem);
  thisController.set("hierarchyEdge", clickedItem) ;
  thisController.set("showHierarchyNodeCard", false);
  thisController.set("showHierarchyEdgeCard", true)
}
