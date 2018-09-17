'use strict'
import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/custKpiFormula/custKpiFormula';
import mutation from 'ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPut';
import mutationDeleteFull from 'ember-gui/gql/mutations/custKpiFormula/custKpiFormulaDeleteFull';
import queryParent from 'ember-gui/gql/queries/custKpiFormula/custKpiFormulas';
import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';
// import { inject as service } from "@ember/service";



export default Route.extend(RouteQueryManager,{
    // apollo: service(),
  model(params) {
    let variables = { _key: params.key };
    return  this.get('apollo').watchQuery({ query, variables }, "custKpiFormula");
  },
  actions: {
    updateData() {
      //Copy the model and remove the __typename property
      let currentModel = this.modelFor(this.routeName)[0];
      let input = JSON.parse(JSON.stringify(currentModel));
      let key = input._key;
      delete input.__typename;
      //Set the variables
      let variables = { key, input};
      //Update the backend
      return this.get("apollo").mutate({mutation, variables,
        update: (store, mutationResult) => {

          UpdateStore.updateRecordFromDetail(store, query, key, mutationResult.data.custKpiFormulaPut,"custKpiFormula")
          UpdateStore.updateRecordFromSelection(store, queryParent, key, mutationResult.data.custKpiFormulaPut, "custKpiFormulas")
          // //update the local store
          // //Set the variables, not how this matches the actual variable in the mutation
          // let updateVars = { _key: key };
          // //Get the existing query from the store and replace the data
          // //note the try catch is the only way to check if the query in
          // //already in the store;
          // try {
          //   const data = store.readQuery({ query, variables: updateVars });
          //   data.custKpiFormula.pop();
          //   data.custKpiFormula.push(mutationResult.data.custKpiFormulaPut);
          //   //Update the store only if the query was already there,
          //   //otherwise it will be automatically fetched later
          //   store.writeQuery({ query, data, variables: updateVars})
          // } catch (e) {
          //   // Do nothing
          // }

        }
      }, "custKpiFormula")
    },
    deleteData(){
      //Copy the model and remove the __typename property
      let currentModel = this.modelFor(this.routeName)[0];
      //let input = JSON.parse(JSON.stringify(currentModel));
      let key = currentModel._key;
      //Set the variables
      let variables = { key };
      //Update the backend
      return this.get("apollo").mutate({mutation: mutationDeleteFull, variables,
        //update: (store, mutationResult) => {
        update: (store) => {
          //update the local store
          //Set the variables, not how this matches the actual variable in the mutation
          // let updateVars = { _key: key };
          // try {
          //   const dataCurrent = store.readQuery({ query, variables: updateVars });
          //   dataCurrent.custKpiFormula.pop();
          //   //Update the store only if the query was already there,
          //   //otherwise it will be automatically fetched later
          //   store.writeQuery({ query, data: dataCurrent, variables: updateVars})
          // } catch (e) {
          //   // Do nothing
          // }
          UpdateStore.removeRecordFromDetail(store, query, key, "custKpiFormula")
          UpdateStore.removeRecordFromSelection(store, queryParent, key, "custKpiFormulas")

          // //Get the existing query from the store and replace the data
          // //note the try catch is the only way to check if the query in
          // //already in the store;
          // try {
          //   // Find record in the store for the parent query  and remove it
          //   //so user does not manually have to refresh
          //   const data = store.readQuery({ query: queryParent });
          //   var index = data.custKpiFormulas.map(x =>  x._key ).indexOf(key);
          //   data.custKpiFormulas.splice(index, 1);
          //   //Update the store
          //   store.writeQuery({ query: queryParent, data})
          // } catch (e) {
          //   // Do nothing
          // }

        }
      })
      .then( () => {
        this.transitionTo('custKpiFormulas');
      })

    }
  }

});
