import Route from '@ember/routing/route';
import { RouteQueryManager } from 'ember-apollo-client';
import query from 'ember-gui/gql/queries/invoice/invoice';
//import mutation from 'ember-gui/gql/mutations/invoice/invoicePut';
//import mutationDeleteFull from 'ember-gui/gql/mutations/invoice/invoiceDeleteFull';
// import queryParent from 'ember-gui/gql/queries/invoice/invoices';
// import MutationHelper from 'ember-gui/gql/gqlHelpers/executeMutation';

export default Route.extend(RouteQueryManager,{

  model(params) {
    let variables = { _key: params.key };
    return  this.get('apollo').watchQuery({ query, variables }, "invoice");
  },
  actions: {
    updateData() {
      // MutationHelper.genericUpdateData(this,'invoices.index', "invoices", queryParent,
      //                                 "invoice", query, mutation,this.get("apollo"))
      alert('Not implemented yet. The stars had not yet aligned')
    },
    deleteData(){
      // MutationHelper.genericDeleteDataFull(this, 'invoices.index', 'invoices',
      //                                       queryParent, 'invoices',
      //                                      'invoice',query, mutationDeleteFull,
      //                                      this.get("apollo"))
      alert('Not implemented yet. The stars had not yet aligned')
    }
  }
});
