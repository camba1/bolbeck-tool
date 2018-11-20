import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | customers/show/show-invoice-dashboard', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:customers/show/show-invoice-dashboard');
    assert.ok(route);
  });
});
