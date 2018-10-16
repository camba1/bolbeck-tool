import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('cust-kpi-formulas', function() {
    this.route('show', { path: '/:key' });
    this.route('new');
  });
  this.route('products', function() {
    this.route('show', { path: '/:key' }, function() {
        this.route('show-detail');
    });

  });
  this.route('main')
});

export default Router;
