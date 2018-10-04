import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import EmberObject from '@ember/object'

module('Integration | Component | cust-kpi-formula-listing', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.custKpiFormula = [EmberObject.create({
      _key: '123',
      name: 'Test',
      formula: 'x + y',
      type: 'Quantity',
      validityDate: '01/01/2001',
      calculationOrder: 2
    })];
  });

  // test('it renders', async function(assert) {
  //   // Set any properties with this.set('myProperty', 'value');
  //   // Handle any actions with this.set('myAction', function(val) { ... });
  //
  //   await render(hbs`{{cust-kpi-formula-listing}}`);
  //
  //   assert.equal(this.element.textContent.trim(),'template block text');

    // Template block usage:
    // await render(hbs`
    //   {{#cust-kpi-formula-listing}}
    //     template block text
    //   {{/cust-kpi-formula-listing}}
    // `);
    //
    // assert.equal(this.element.textContent.trim(), 'template block text');
  // });

  test('should display Kpi formula details', async function(assert) {
    await render(hbs`{{cust-kpi-formula-listing custKpiFormula = custKpiFormula}}`)
    let rows = this.element.querySelector('.table .mybody').rows;
    let key = rows[0].getElementsByClassName('key')[0].textContent;
    let formula = rows[0].getElementsByClassName('formula')[0].textContent
    assert.equal(rows.length, 1, "the table had " + rows + " rows");
    assert.equal(key,'123', 'Key 123');
    assert.equal(formula, 'x + y', 'Formula: x + y');
  })

});
