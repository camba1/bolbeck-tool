import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/invoice/invoicesByCustomerKey';

export default Route.extend(RouteQueryManager,{
  //model(params){
  model(){
    let customerKey = this.paramsFor('customers.show').key
    let variables
    // if (params.qname) {
       // variables = { name: params.qname }
    // }else {
    //  variables = {input: {_key: product_Key, direction: "outbound", maxDepth: 2 }}
    // }
    variables = {customerKey : customerKey, input: { includeProducts: false }}
    return this.get('apollo').watchQuery({ query, variables }, "invoicesByCustomerKeyGet")
    .catch(error => alert(error));
  }//,
  // actions: {
  //   didTransition() {
  //     this.controller.set("showHierarchyNodeCard", true);
  //     this.controller.set("showHierarchyEdgeCard", false)
  //     this.controller.set("hierarchyNode", undefined);
  //     this.controller.set("hierarchyEdge", undefined);
  //     this.controller.set('expandedNodeData',[]);
  //     return true;
  //   }
  // }
});
