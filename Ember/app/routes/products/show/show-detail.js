import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    let mymodel = this.modelFor('products.show');
    return mymodel;
  }
});
