import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/product/products';

export default Route.extend(RouteQueryManager,{
  model(params){
    let variables
    if (params.qname) {
       variables = { name: params.qname }
    }
    return this.get('apollo').watchQuery({ query, variables }, "products")
    .catch(error => alert(error));
    //return this.get('apollo').query({ query , variables, fetchPolicy: "network-only" },"custKpiFormulas")
    // return this.get('apollo').watchQuery({ query }, "custKpiFormulas");

  },
  actions: {
    refreshData(name) {
      //return this.get('apollo').query({ query , fetchPolicy: "network-only" }, "custKpiFormulas")
      //let variables
      if (name) {
         //variables = { name }
         this.controllerFor(this.routeName).set('qname',name)
      } else {
        this.controllerFor(this.routeName).set('qname',null)
      }
    }
  }
});
