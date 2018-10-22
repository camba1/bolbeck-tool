import Controller, {  inject as controller }  from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  productController: controller('products/show'),
  productModel: computed('model', function(){
     return this.get('productController.model')
   }),
  hierarchyNode: undefined,
  hierarchyEdge: undefined,
  hierarchyEdgeParent: 'test',
  showHierarchyNodeCard: false,
  showHierarchyEdgeCard: false,
 actions: {
   graphNodeClicked(clickedItemKey, clickType ) {
    clickType == 'node' ? populateNodeInfo(this, clickedItemKey) :
                          populateEdgeInfo(this,clickedItemKey)
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
