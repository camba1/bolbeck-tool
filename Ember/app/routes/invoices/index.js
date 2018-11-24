import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/invoice/invoices';

export default Route.extend(RouteQueryManager,{
  queryParams: {
    qcustomerName: {
      refreshModel: true
    },
    qinvoiceDate: {
      refreshModel: true
    },
    q_key: {
      refreshModel: true
    }
},
  model(params){
    //load the query parameters into the input variable and then variables so whe can use in GraphQL query
    //note that the GraphQL variable name are the same as the query params but without the q at the start
    let variables = {};
    let input = Object.assign({}, ...Object.keys(params).map(k => (params[k] ? {[k.slice(1)]: params[k]} : '')))
    if (input) {
      variables.input = input
    }
    return this.get('apollo').watchQuery({ query, variables }, "invoices")
    .catch(error => alert(error));
  },
  actions: {
    refreshData(customerName, key, invoiceDate) {
      let myController = this.controllerFor(this.routeName)
      myController.set('qcustomerName', getQueryParamValue(customerName));
      myController.set('q_key', getQueryParamValue(key));
      myController.set('qinvoiceDate', getQueryParamValue(invoiceDate));
    },
    resetqueryParams(){
      let myController = this.controllerFor(this.routeName)
      myController.set('qcustomerName', null);
      myController.set('customerName', null);
      myController.set('q_key', null);
      myController.set('key', null);
      myController.set('qinvoiceDate', null);
      myController.set('invoiceDate', null);
    }

  }
});

/**
 * If param has a value, return it otherwise return null
 * @param {Object} param Value to be checked
 * @returns {Object} param or null
 */
function getQueryParamValue(param){
  if (param) {
     return param
  } else {
    return null
  }
}
