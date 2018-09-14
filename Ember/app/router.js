import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('custKpiFormulas', function() {
    this.route('show', { path: '/:key' });
    this.route('new');
  });
  this.route('products');
  this.route('main')
});

export default Router;
