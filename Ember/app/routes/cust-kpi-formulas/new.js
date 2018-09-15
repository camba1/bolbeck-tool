import Route from '@ember/routing/route';
import { inject as service } from "@ember/service";
import EmberObject from "@ember/object";
import mutation from "ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPost";
import mutationUpdate from 'ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPut';

export default Route.extend({
  apollo: service(),
  model() {
    return  Ember.Object.create({});
  },
  actions: {
    saveNewData() {
      let currentModel = this.modelFor(this.routeName);
      let variables = { input: currentModel };
      return this.get("apollo").mutate({ mutation, variables,
        update: (store, mutationResult) => {
          Ember.setProperties(currentModel, mutationResult.data.custKpiFormulaPost)
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
      return this.get("apollo").mutate({mutation: mutationUpdate, variables}, "custKpiFormula")
    }
  }
});
