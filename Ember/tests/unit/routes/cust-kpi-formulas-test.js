import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | custKpiFormulas', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:cust-kpi-formulas');
    assert.ok(route);
  });
});
