import Controller, {  inject as controller }  from '@ember/controller';
import queryHierarchy from 'ember-gui/gql/queries/product/prodHierarchy';
import { computed } from '@ember/object';

export default Controller.extend({
  productController: controller('products/show'),
  productModel: computed('model', function(){
     return this.get('productController.model')
   }),
  bottonHierarchyLevel: 'sku',
  apolloHierarchyQueryId: 'prodHierarchy',
  hierarchyQuery: queryHierarchy,
  hierarchyNode: undefined,
  hierarchyEdge: undefined,
  hierarchyEdgeParent: undefined,
  showHierarchyNodeCard: false,
  showHierarchyEdgeCard: false,
 actions: {
   graphNodeClicked(clickedItemKey, clickType, menuOptionName ) {
      if (menuOptionName) {
        menuOptionName == 'link' ? this.transitionToRoute('products.show.show-detail',clickedItemKey): ''
      } else {
        clickType == 'nodes' ? populateNodeInfo(this, clickedItemKey) :
                              populateEdgeInfo(this,clickedItemKey)
      }
   }
 }
});

function populateNodeInfo(thisController, clickedItemKey) {
  let clickedItem
  clickedItem = clickedItemKey == thisController.productModel[0]._key ?
     thisController.productModel[0] :
     thisController.model.find((product) => { return product._key == clickedItemKey} );
  thisController.set("hierarchyNode", clickedItem) ;
  thisController.set("showHierarchyNodeCard", true);
  thisController.set("showHierarchyEdgeCard", false)
}
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
