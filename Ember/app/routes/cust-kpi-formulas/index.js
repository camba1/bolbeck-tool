import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/custKpiFormula/custKpiFormulas';

// export default Route.extend({
//   model(){
//     return [{
//       "_key": "test",
//       "name": "bla",
//       "formula": "bl",
//       "type": "blah",
//       "validityDate": "1999-01-01",
//       "calculationOrder": 1
//     },
//     {
//       "_key": "test2",
//       "name": "bla2",
//       "formula": "bl",
//       "type": "blah",
//       "validityDate": "1999-01-01",
//       "calculationOrder":1
//     }]
//   }
// });

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
    return this.get('apollo').watchQuery({ query, variables }, "custKpiFormulas")
    .catch(error => alert(error));
    //return this.get('apollo').query({ query , variables, fetchPolicy: "network-only" },"custKpiFormulas")
    // return this.get('apollo').watchQuery({ query }, "custKpiFormulas");

  },
  actions: {
    refreshData(name) {
      //return this.get('apollo').query({ query , fetchPolicy: "network-only" }, "custKpiFormulas")
      let variables
      if (name) {
         variables = { name }
         this.controllerFor(this.routeName).set('qname',name)
      } else {
        this.controllerFor(this.routeName).set('qname',null)
      }
    }
  }
});
