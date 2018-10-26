import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/product/prodHierarchy';
// import mutation from 'ember-gui/gql/mutations/product/productPut';
// import mutationDeleteFull from 'ember-gui/gql/mutations/product/productDeleteFull';
// import queryParent from 'ember-gui/gql/queries/product/products';
// import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';
export default Route.extend(RouteQueryManager,{
  model(params){
    let product_Key = this.paramsFor('products.show').key
    let variables
    if (params.qname) {
       variables = { name: params.qname }
    }else {
      variables = {input: {_key: product_Key, direction: "outbound", maxDepth: 2 }}
    }
    return this.get('apollo').watchQuery({ query, variables }, "prodHierarchy")
    .catch(error => alert(error));
  },
  actions: {
    didTransition() {
      this.controller.set("showHierarchyNodeCard", true);
      this.controller.set("showHierarchyEdgeCard", false)
      this.controller.set("hierarchyNode", undefined);
      this.controller.set("hierarchyEdge", undefined);
      this.controller.set('expandedNodeData',[]);
      return true;
    }
  }
});
