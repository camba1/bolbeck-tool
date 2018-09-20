import { module, test } from 'qunit';
import { visit, currentURL, find , click, settled, fillIn} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

let document = { _key: "testEmber1", name : "testEmber1", formula: "formula1", type : "type1", validityDate : "1999-01-01", calculationOrder : 1 }

module('Acceptance | cust kpi formulas', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /cust-kpi-formulas', async function(assert) {
    await visit('/cust-kpi-formulas');
    assert.equal(currentURL(), '/cust-kpi-formulas');

  });


  test('visiting /cust-kpi-formulas', async function(assert) {
    // let apollo = this.owner.lookup('service:apollo');
    // let getQueries = () => apollo.client.queryManager.queryStore.getStore();

    await visit('/cust-kpi-formulas');

    assert.equal(find('.mainTitle').innerText, 'Customer KPI Formulas', 'Verify main page title');

    await click('.newBtn');
    await settled();
    assert.equal(currentURL(), '/cust-kpi-formulas/new', 'Transition to new record page');

    //debugger;
    let currentModel = this.owner.lookup('route:cust-kpi-formulas/new').modelFor('cust-kpi-formulas.new');

    await fillIn('.modelName', document.name);
    await fillIn('.modelFormula', document.formula);
    await fillIn('.modelType', document.type);
    await fillIn('.modelValidityDate', document.validityDate);
    await fillIn('.modelCalculationOrder', document.calculationOrder);

    assert.notOk(currentModel._key, 'Verify the key of the record is empty');
    await click('.saveNewDataBtn');
    assert.ok(currentModel._key,'Key is populated after save');
    document._key = currentModel._key;

  });
});
