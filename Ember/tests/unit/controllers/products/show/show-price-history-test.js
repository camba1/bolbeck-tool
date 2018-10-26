import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | /products/show/show-price-history', function(hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:/products/show/show-price-history');
    assert.ok(controller);
  });
});
