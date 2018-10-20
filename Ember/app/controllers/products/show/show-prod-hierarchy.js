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
    this.set("hierarchyNode", clickedNodeKey) ;
   }
 }
});
