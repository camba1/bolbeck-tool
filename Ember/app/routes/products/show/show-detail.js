import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    let mymodel = this.modelFor('products.show');
    return mymodel;
  }
});
