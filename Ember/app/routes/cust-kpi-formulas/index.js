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
  model(){
    return this.get('apollo').watchQuery({ query }, "custKpiFormulas");

  },
  actions: {
    refreshData() {
      return this.get('apollo').query({ query , fetchPolicy: "network-only" }, "custKpiFormulas")
      .catch(error => alert(error));
    }
  }
});
