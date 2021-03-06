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
      this.route('show-prod-hierarchy');
      this.route('show-price-history');
    });

  });
  this.route('main')
  this.route('customers', function() {
    this.route('show', { path: '/:key' }, function() {
      this.route('show-detail');
      this.route('show-invoice-dashboard');
      this.route('show-invoice-explorer');
    });
  });
  this.route('invoices', function() {
    this.route('show', { path: '/:key' },function() {
      this.route('show-detail');
    });
  });
});

export default Router;
