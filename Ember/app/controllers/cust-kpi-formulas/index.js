import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  queryParams: ['qname'],
  qname: null,

  name: computed.oneWay('qname'),
  //Live onscreen fitlering
  filteredModel: computed('name','model', function(){
    if (this.get('model')) {
      let name = this.name;
      let model = this.get('model');
      if (name) {
        //return model.filterBy('name', name);
        return model.filter((x) => x.name.substring(0,name.length) == name );
      } else {
        return model ;
      }
    }
  })

});
