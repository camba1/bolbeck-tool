import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | customers/show/show-detail', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:customers/show/show-detail');
    assert.ok(route);
  });
});
