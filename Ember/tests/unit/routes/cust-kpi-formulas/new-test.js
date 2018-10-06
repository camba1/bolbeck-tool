import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
// import { run } from '@ember/runloop';
// import { print } from 'graphql';
// import mutationPost from "ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPost";
// import EmberObject from "@ember/object";
// import { Promise } from "rsvp";

//const documents = [{ _key: "testGQL2", name : "name2", formula: "formula2", type : "type2", validityDate : "1999-01-01", calculationOrder : 2 },
//                   { _key: "testGQL3", name : "name3", formula: "formula3", type : "type3", validityDate : "1999-01-01", calculationOrder : 3 }];

//const document3Replacement = { _key: "testGQL3", name : "name3_1", formula: "formula3", type : "type31", validityDate : "1999-01-01", calculationOrder : 3 }
//const document2Update = { color : "color2"};
//const collectionName = 'custKpiFormula'


//const document = { _key: "testGQL1", name : "name1", formula: "formula1", type : "type1", validityDate : "1999-01-01", calculationOrder : 1 }


module('Unit | Route | custKpiFormulas/new', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:cust-kpi-formulas/new');
    assert.ok(route);
  });

//TODO: Fix this test
//   test('it should use the correct post mutation in the SaveNewData action', function(assert) {
// debugger;
//     let route = this.owner.lookup('route:cust-kpi-formulas/new');
//     assert.expect(2);
//
//     let emberDocument = EmberObject.create(document);
//
//     let apollo = {
//       mutate({mutation, variables}) {
//         assert.equal(print(mutation).trim(), print(mutationPost).trim(), 'Uses the correct mutation');
//         assert.deepEqual( variables, {input: emberDocument}, 'Mutation variables match');
//
//         //Return a promise because the actual code expects a promise in the end otherwiase the .catch block
//         // in the actual code becomes undefined and fails.
//         return new Promise(function(fulfill) {
//           fulfill( {custKpiFormulaPost: { custKpiFormula: document }} );
//         });
//         // return  {
//         //   custKpiFormulaPost: {
//         //     custKpiFormula: document
//         //   },
//         // };
//       },
//     };
//     route.set('apollo',apollo);
//
//     run( () => { route.send('saveNewData', emberDocument)})
//
//   });


});
