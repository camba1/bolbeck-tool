import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/product/product';
import mutation from 'ember-gui/gql/mutations/product/productPut';
import mutationDeleteFull from 'ember-gui/gql/mutations/product/productDeleteFull';
import queryParent from 'ember-gui/gql/queries/product/products';
import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';

export default Route.extend(RouteQueryManager,{

  model(params) {
    let variables = { _key: params.key };
    return  this.get('apollo').watchQuery({ query, variables }, "product");
  },
  actions: {
    updateData() {
      //Copy the model and remove the __typename property
      let currentModel = this.modelFor(this.routeName)[0];
      let input = JSON.parse(JSON.stringify(currentModel));
      let key = input._key;
      delete input.__typename;

      //Get the parent variables so we can update the parent query
      let parentVariables = this.modelFor('products.index') ?
                            this.modelFor('products.index')._apolloObservable.variables :
                            null;

      //Set the variables
      let variables = { key, input};
      //Update the backend
      return this.get("apollo").mutate({mutation, variables,
        update: (store, mutationResult) => {

          UpdateStore.updateRecordFromDetail(store, query, key, mutationResult.data.productPut,"product")
          UpdateStore.updateRecordFromSelection(store, queryParent, key, mutationResult.data.productPut, "products", parentVariables)

        }
      }, "product")
    },
    deleteData(){
      //Copy the model and remove the __typename property
      let currentModel = this.modelFor(this.routeName)[0];
      let key = currentModel._key;

      //Get the parent variables so we can update the parent query
      let parentVariables = this.modelFor('products.index') ?
                            this.modelFor('products.index')._apolloObservable.variables :
                            null;
      //Set the variables
      let variables = { key };
      //Update the backend
      return this.get("apollo").mutate({mutation: mutationDeleteFull, variables,
        update: (store) => {
          UpdateStore.removeRecordFromDetail(store, query, key, "product")
          UpdateStore.removeRecordFromSelection(store, queryParent, key, "products", parentVariables)
        }
      })
      .then( () => {
        this.transitionTo('products');
      })

    }
  }
});
