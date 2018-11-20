import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | customers/show/show-invoice-dashboard', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:customers/show/show-invoice-dashboard');
    assert.ok(controller);
  });
});
