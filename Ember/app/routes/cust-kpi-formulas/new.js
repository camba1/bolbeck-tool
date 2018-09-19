import Route from '@ember/routing/route';
import { inject as service } from "@ember/service";
import EmberObject from "@ember/object";
import mutation from "ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPost";
import mutationUpdate from 'ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPut';
import queryParent from 'ember-gui/gql/queries/custKpiFormula/custKpiFormulas';
import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';


export default Route.extend({
  apollo: service(),
  model() {
    return  EmberObject.create({});
  },
  actions: {
    saveNewData(custKpiFormula) {
      let currentModel = custKpiFormula; //this.modelFor(this.routeName);
      let variables = { input: currentModel };
      return this.get("apollo").mutate({ mutation, variables,
        update: (store, mutationResult) => {
          //Since this is a locally created record, the store for the detail screen does not need to be updated
          // we just need to update the local model with the data from the mutation result
          currentModel.setProperties( mutationResult.data.custKpiFormulaPost);
          //We do however need to update the selection screen so that the user does not need to refresh
          UpdateStore.addRecordFromSelection(store, queryParent, mutationResult.data.custKpiFormulaPost, "custKpiFormulas")
        }
     }, "custKpiFormula")
      // .then( () => {
      //   currentModel = Ember.Object.create({});
      //   this.transitionTo('custKpiFormulas');
      // })
      .catch(error => alert(error));
    },
    updateData() {
      let currentModel = this.modelFor(this.routeName);
      let input = JSON.parse(JSON.stringify(currentModel));
      let key = input._key;
       delete input.__typename;
      //Set the variables
      let variables = { key, input };
      //Update the backend
      return this.get("apollo").mutate({mutation: mutationUpdate, variables,
        update: (store, mutationResult) => {
          //We still have the local object bound to the screen, so not need to update the store for that
          //just update the store for the selection screen
          UpdateStore.updateRecordFromSelection(store, queryParent, key, mutationResult.data.custKpiFormulaPut, "custKpiFormulas")
        }
      }, "custKpiFormula")
    }
  }
});
