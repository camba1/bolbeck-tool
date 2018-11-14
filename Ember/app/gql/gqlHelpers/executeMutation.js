import UpdateStore from 'ember-gui/gql/gqlHelpers/updateStore';

/**
 * Deletes a record from a detail screen by calling the DB to reomve the record and
 * then removing the record from the cache both for the detail screen and the
 * parent selection screen
 * @param {object} that Refernce to the calling object in charge of the mutation, usually a Route
 * @param {string} parentRouteName Name of the route to the parent selection screen
 * @param {string} parentQueryIdentifier Identifier used by apollo graphQL to id the query of the parent selection screen
 * @param {object} parentQueryObject Query used by the parent selection screen
 * @param {string} transtiontoRouteName Name of the route to transtition to once the deletion is complete
 * @param {string} queryIdentifier Identifier used by apollo graphQL to id the query of the current screen
 * @param {object} queryObject Query used by the current screen
 * @param {object} deleteMutationObject Mutation object to be used to delete the record
 * @param {object} apolloService Refernce to the apollo GraphQL service
 * @returns No return value but it transitions back to the parent selection screen
 */
function genericDeleteDataFull(that, parentRouteName, parentQueryIdentifier,
                              parentQueryObject, transtiontoRouteName,
                              queryIdentifier,queryObject, deleteMutationObject,
                              apolloService){
  //Copy the model and remove the __typename property
  let currentModel = that.modelFor(that.routeName)[0];
  let key = currentModel._key;

  //Get the parent variables so we can update the parent query
  let parentVariables = that.modelFor(parentRouteName) ?
                        that.modelFor(parentRouteName)._apolloObservable.variables :
                        null;
  //Set the variables
  let variables = { key };
  //Update the backend
  return apolloService.mutate({mutation: deleteMutationObject, variables,
    update: (store) => {
      UpdateStore.removeRecordFromDetail(store, queryObject, key, queryIdentifier)
      UpdateStore.removeRecordFromSelection(store, parentQueryObject, key, parentQueryIdentifier, parentVariables)
    }
  })
  .then( () => {
    that.transitionTo(transtiontoRouteName);
  })
}


export default  {
  genericDeleteDataFull
}
