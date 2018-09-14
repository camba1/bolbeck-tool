import Route from '@ember/routing/route';
import { inject as service } from "@ember/service";
import EmberObject from "@ember/object";
import mutation from "ember-gui/gql/mutations/custKpiFormula/custKpiFormulaPost";

export default Route.extend({
  apollo: service(),
  model() {
    return  Ember.Object.create({});
  },
  actions: {
    saveNewData() {
      let currentModel = this.modelFor(this.routeName);
      let variables = { input: currentModel };
      debugger;
      return this.get("apollo").mutate({ mutation, variables }, "custKpiFormula")
      .then( () => {
        currentModel = Ember.Object.create({});
        this.transitionTo('custKpiFormulas');
      })
      .catch(error => alert(error));
    }
  }
});
