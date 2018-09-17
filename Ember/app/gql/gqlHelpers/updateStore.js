
function updateRecordFromDetail(currentStore, detailQuery, recordKey, updatedData, objToUpdateName){
  //update the local store
  //Set the variables, not how this matches the actual variable in the mutation
  let updateVars = { _key: recordKey };
  //Get the existing query from the store and replace the data
  //note the try catch is the only way to check if the query in
  //already in the store;
  try {
    const data = currentStore.readQuery({ query: detailQuery, variables: updateVars });
    data[objToUpdateName].pop();
    data[objToUpdateName].push(updatedData);
    //Update the store only if the query was already there,
    //otherwise it will be automatically fetched later
    currentStore.writeQuery({ query: detailQuery, data, variables: updateVars})
  } catch (e) {
    // Do nothing
  }
}


function updateRecordFromSelection(currentStore, selectionQuery, recordKey, updatedData, objToUpdateName){
  //update the local store
  //Get the existing query from the store and replace the data
  //note the try catch is the only way to check if the query in
  //already in the store;
  try {
    const data = currentStore.readQuery({ query: selectionQuery });
    var index = data[objToUpdateName].map(x =>  x._key ).indexOf(recordKey);
    data[objToUpdateName].splice(index, 1, updatedData);
    //Update the store only if the query was already there,
    //otherwise it will be automatically fetched later
    currentStore.writeQuery({ query: selectionQuery, data})
  } catch (e) {
    // Do nothing
  }
}



//// TODO: write the patch function for partial updates
function patchRecordFromDetail(){
  let i = 1;
}

function removeRecordFromDetail(currentStore, detailQuery, recordKey, objToUpdateName){
  //update the local store
  //Set the variables, not how this matches the actual variable in the mutation
  let updateVars = { _key: recordKey };
  try {
    const dataCurrent = currentStore.readQuery({ query: detailQuery, variables: updateVars });
     dataCurrent[objToUpdateName].pop();
    //Update the store only if the query was already there,
    //otherwise it will be automatically fetched later
    currentStore.writeQuery({ query: detailQuery, data: dataCurrent, variables: updateVars})
  } catch (e) {
    // Do nothing
  }

}

function removeRecordFromSelection(currentStore, selectionQuery, recordKey, objToUpdateName){
  //Get the existing query from the store and replace the data
  //note the try catch is the only way to check if the query in
  //already in the store;
  try {
    // Find record in the store for the parent query  and remove it
    //so user does not manually have to refresh
    const data = currentStore.readQuery({ query: selectionQuery });
    var index = data[objToUpdateName].map(x =>  x._key ).indexOf(recordKey);
    data[objToUpdateName].splice(index, 1);
    //Update the store
    currentStore.writeQuery({ query: selectionQuery, data})
  } catch (e) {
    // Do nothing
  }

}


function addRecordFromSelection(currentStore, selectionQuery, newData, objToUpdateName){
  //Get the existing query from the store and and the new record
  //note the try catch is the only way to check if the query in
  //already in the store;
  try {
    // Find the store for the parent query  and add it
    //so user does not manually have to refresh
    const data = currentStore.readQuery({ query: selectionQuery });
    data[objToUpdateName].unshift(newData);
    //Update the store
    currentStore.writeQuery({ query: selectionQuery, data})
  } catch (e) {
    // Do nothing
  }

}



export default  {
  updateRecordFromDetail,
  updateRecordFromSelection,
  removeRecordFromDetail,
  removeRecordFromSelection,
  addRecordFromSelection
}
