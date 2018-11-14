import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/customer/customers';

export default Route.extend(RouteQueryManager,{
  queryParams: {
  qname: {
    refreshModel: true
  },
  q_key: {
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
    //load the query parameters into the input variable and then variables so whe can use in GraphQL query
    //note that the GraphQL variable name are the same as the query params but without the q at the start
    let variables = {};
    let input = Object.assign({}, ...Object.keys(params).map(k => (params[k] ? {[k.slice(1)]: params[k]} : '')))
    if (input) {
      variables.input = input
    }
    return this.get('apollo').watchQuery({ query, variables }, "customers")
    .catch(error => alert(error));
  },
  actions: {
    refreshData(name, key, state, city) {
      let myController = this.controllerFor(this.routeName)
      myController.set('qname', getQueryParamValue(name));
      myController.set('q_key', getQueryParamValue(key));
      myController.set('qstate', getQueryParamValue(state));
      myController.set('qcity', getQueryParamValue(city));
    },
    resetqueryParams(){
      let myController = this.controllerFor(this.routeName)
      myController.set('qname', null);
      myController.set('name', null);
      myController.set('q_key', null);
      myController.set('key', null);
      myController.set('qstate', null);
      myController.set('state', null);
      myController.set('qcity', null);
      myController.set('city', null);
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
