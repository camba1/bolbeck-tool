import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  isSku: computed('model', function(){
     return this.model[0].hierarchyLevel == 'sku';
   })
});
