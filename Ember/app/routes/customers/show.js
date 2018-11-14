import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/customer/customer';
import mutation from 'ember-gui/gql/mutations/customer/customerPut';
import mutationDeleteFull from 'ember-gui/gql/mutations/customer/customerDeleteFull';
import queryParent from 'ember-gui/gql/queries/customer/customers';
import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';
import MutationHelper from 'ember-gui/gql/gqlHelpers/executeMutation';

export default Route.extend(RouteQueryManager,{

  model(params) {
    let variables = { _key: params.key };
    return  this.get('apollo').watchQuery({ query, variables }, "customer");
  },
  actions: {
    updateData() {
      // //Copy the model and remove the __typename property
      // let currentModel = this.modelFor(this.routeName)[0];
      // let input = JSON.parse(JSON.stringify(currentModel));
      // let key = input._key;
      // delete input.__typename;
      // delete input._key;
      // delete input._id;
      //
      // //Get the parent variables so we can update the parent query
      // let parentVariables = this.modelFor('customers.index') ?
      //                       this.modelFor('customers.index')._apolloObservable.variables :
      //                       null;
      //
      // //Set the variables
      // let variables = { key, input};
      // //Update the backend
      // return this.get("apollo").mutate({mutation, variables,
      //   update: (store, mutationResult) => {
      //
      //     UpdateStore.updateRecordFromDetail(store, query, key, mutationResult.data.customerPut,"customer")
      //     UpdateStore.updateRecordFromSelection(store, queryParent, key, mutationResult.data.customerPut, "customers", parentVariables)
      //
      //   }
      // }, "customer")
      MutationHelper.genericUpdateData(this,'customers.index', "customers", queryParent,
                                      "customer", query, mutation,this.get("apollo"))
    },
    deleteData(){
      // //Copy the model and remove the __typename property
      // let currentModel = this.modelFor(this.routeName)[0];
      // let key = currentModel._key;
      //
      // //Get the parent variables so we can update the parent query
      // let parentVariables = this.modelFor('customers.index') ?
      //                       this.modelFor('customers.index')._apolloObservable.variables :
      //                       null;
      // //Set the variables
      // let variables = { key };
      // //Update the backend
      // return this.get("apollo").mutate({mutation: mutationDeleteFull, variables,
      //   update: (store) => {
      //     UpdateStore.removeRecordFromDetail(store, query, key, "customer")
      //     UpdateStore.removeRecordFromSelection(store, queryParent, key, "customers", parentVariables)
      //   }
      // })
      // .then( () => {
      //   this.transitionTo('customers');
      // })
      MutationHelper.genericDeleteDataFull(this, 'customers.index', 'customers',
                                            queryParent, 'customers',
                                           'customer',query, mutationDeleteFull,
                                           this.get("apollo"))

    }
  }
});
