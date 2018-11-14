import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/customer/customers';

export default Route.extend(RouteQueryManager,{
  queryParams: {
  qname: {
    refreshModel: true
  },
  qkey: {
    refreshModel: true
  },
  qstate: {
    refreshModel: true
  },
  qcity: {
    refreshModel: true
  },
},
  model(params){
    let variables
    if (params.qname) {
       variables = {input: {name: params.qname }}
    }
    return this.get('apollo').watchQuery({ query, variables }, "customers")
    .catch(error => alert(error));
  },
  actions: {
    refreshData(name, key, state, city) {
      let myController = this.controllerFor(this.routeName)
      if (name) {
         this.controllerFor(this.routeName).set('qname',name)
      } else {
        this.controllerFor(this.routeName).set('qname',null)
      }
      myController.set('qkey', getQueryParamValue(key));
      myController.set('qstate', getQueryParamValue(state));
      myController.set('qcity', getQueryParamValue(city));
    }
  }
});

function getQueryParamValue(param){
  if (param) {
     return param
  } else {
    return null
  }
}
