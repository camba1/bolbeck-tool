'use strict'
import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/custKpiFormula/custKpiFormula';
import mutation from 'ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPut';



export default Route.extend(RouteQueryManager,{
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
          //update the local store
          //Set the variables, not how this matches the actual variable in the mutation
          let updateVars = { _key: key };
          //Get the existing query from the store and replace the data
          //note the try catch is the only way to check if the query in
          //already in the store;
          try {
            const data = store.readQuery({ query, variables: updateVars });
            data.custKpiFormula.pop();
            data.custKpiFormula.push(mutationResult.data.custKpiFormulaPut);
            //Update the store only if the query was already there,
            //otherwise it will be automatically fetched later
            store.writeQuery({ query, data, variables: updateVars})
          } catch (e) {
            // Do nothing
          }

        }
      }, "custKpiFormula")
    }
  }

});
