import Controller, {  inject as controller }  from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  myController: controller('products/show'),
  productModel: computed('model', function(){
     return this.get('myController.model')
   }),
  hierarchyNode: 'test',
  hierarchyObject: computed('hierarchyNode', function(){
    return this.hierarchyNode;
  }),
 actions: {
   graphNodeClicked(clickedNodeKey) {
     let clickedProductNode
     clickedProductNode = clickedNodeKey == this.productModel[0]._key ?
        clickedProductNode = this.productModel[0] : 
        this.model.find((product) => { return product._key == clickedNodeKey} );
    this.set("hierarchyNode", clickedProductNode) ;
    // let prodName = clickedProductNode.name
   }
 }
});
