import { module, test } from 'qunit';
import { visit, currentURL, find , click, settled, fillIn, findAll} from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';

let document = { _key: "testEmber1", name : "testEmber1", formula: "formula1", type : "type1", validityDate : "1999-01-01", calculationOrder : 1 }
const documentUpdate = { formula : "formula2"};
const documentUpdate2 = { type: "type2"};

module('Acceptance | cust kpi formulas', function(hooks) {
  setupApplicationTest(hooks);

  test('visiting /cust-kpi-formulas', async function(assert) {
    await visit('/cust-kpi-formulas');
    assert.equal(currentURL(), '/cust-kpi-formulas');

  });


  test('visiting /cust-kpi-formulas/new', async function(assert) {
    // let apollo = this.owner.lookup('service:apollo');
    // let getQueries = () => apollo.client.queryManager.queryStore.getStore();

    await visit('/cust-kpi-formulas');

    assert.equal(find('.mainTitle').innerText, 'Customer KPI Formulas', 'Verify main page title');

    await click('.newBtn');
    await settled();
    assert.equal(currentURL(), '/cust-kpi-formulas/new', 'Transition to new record page');

    // Create a new record
    let currentModel = this.owner.lookup('route:cust-kpi-formulas/new').modelFor('cust-kpi-formulas.new');

    await fillIn('.modelName', document.name);
    await fillIn('.modelFormula', document.formula);
    await fillIn('.modelType', document.type);
    await fillIn('.modelValidityDate', document.validityDate);
    await fillIn('.modelCalculationOrder', document.calculationOrder);

    assert.notOk(currentModel._key, 'Verify the key of the record is empty');
    await click('.saveNewDataBtn');
    assert.ok(currentModel._key,'Key is populated after save');
    assert.equal(currentModel.formula, document.formula, 'Formula is still in model and matches our input')
    document._key = currentModel._key;

    // Update a 'new' record
    await fillIn('.modelFormula', documentUpdate.formula);
    await click('.updateDataBtn');
    await click('.cancelBtn');

    assert.equal(currentURL(), '/cust-kpi-formulas', 'Transition to selection page');
    await settled();

    //The new record should be the first in the listing on the store
    let selectionModel = this.owner.lookup('route:cust-kpi-formulas').modelFor('cust-kpi-formulas.index');
    assert.equal(selectionModel.length > 0, true, 'The selection screen model has data: '.concat(selectionModel.length));
    assert.equal(findAll('.listing').length > 0, true, 'We have the data showing '.concat(findAll('.listing').length));

    let rows = this.element.querySelector('.table .mybody').rows;
    let key = rows[0].getElementsByClassName('key')[0].textContent;
    let formula = rows[0].getElementsByClassName('formula')[0].textContent
    // let keyFoundinDoc = find('.detail.key').innerText.split(' ')
    //                           .reduce((total, x) => {
    //                           total = ((x == document._key) ? total + 1 : total); return total
    //                           } , 0);
    //
    // assert.equal(keyFoundinDoc, 1, 'The document that was inserted in first place');
      assert.equal(key, document._key, 'The document that was inserted in first place');
    // let formulaFoundinDoc = find('.detail.formula').innerText.split(' ')
    //                           .reduce((total, x) => {
    //                           total = ((x == documentUpdate.formula) ? total + 1 : total); return total
    //                           } , 0);
    // assert.equal(formulaFoundinDoc, 1, 'The document was updated with the correct formula');
    assert.equal(formula, documentUpdate.formula, 'The document was updated with the correct formula');
//  });

//  test('visiting /cust-kpi-formulas/show', async function(assert) {


    // Testing show page

    // Update record

    await visit('/cust-kpi-formulas/'.concat(document._key));
    await settled();

    let detailModel = this.owner.lookup('route:cust-kpi-formulas/show').modelFor('cust-kpi-formulas.show');
    assert.ok(detailModel, 'found model');

    let keyFoundinChildDoc = find('.detail.key').innerText.split(' ')
                              .reduce((total, x) => {
                              total = ((x == document._key) ? total + 1 : total); return total
                              } , 0);

    assert.equal(keyFoundinChildDoc, 1, 'The document has the correct key');
    await fillIn('.modelType', documentUpdate2.type);
    await click('.updateDataBtn');
    await click('.backBtn');

    assert.equal(currentURL(), '/cust-kpi-formulas', 'Transition to selection page');
    await settled();


    // Delete record

    await visit('/cust-kpi-formulas/'.concat(document._key));
    await settled();

    assert.equal(find('.modelType').value, documentUpdate2.type, 'Type was updated properly '.concat(currentURL()));

    await click('.deleteDataBtn');
    await settled();

    assert.equal(currentURL(), '/cust-kpi-formulas', 'Transition to selection page after record delete');
    await settled();

    await visit('/cust-kpi-formulas/'.concat(document._key));
    await settled();

    detailModel = this.owner.lookup('route:cust-kpi-formulas/show').modelFor('cust-kpi-formulas.show');

    assert.equal(detailModel.length, 0, 'Document deleted properly');

  });

});
