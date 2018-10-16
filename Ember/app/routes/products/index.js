import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/product/products';

export default Route.extend(RouteQueryManager,{
  queryParams: {
  qname: {
    refreshModel: true
  }
},
  model(params){
    let variables
    if (params.qname) {
       variables = { name: params.qname }
    } 
    return this.get('apollo').watchQuery({ query, variables }, "products")
    .catch(error => alert(error));
  },
  actions: {
    refreshData(name) {
      if (name) {
         this.controllerFor(this.routeName).set('qname',name)
      } else {
        this.controllerFor(this.routeName).set('qname',null)
      }
    }
  }
});
