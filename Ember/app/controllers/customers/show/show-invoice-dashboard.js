import Controller from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.chartLayout = {title: 'Invoice Dashboard'}
  },
  chartDatas: computed('model', function() {
    if (this.get('model')) {
      debugger;
      let model = this.get('model');
      let invoiceDate = model.map(a => a.invoiceDate );
      let totAmount = model.map(a => a.totAmount );
      let key = model.map(a => a._key );
      let seriesOne = {
                        x: invoiceDate,
                        y: totAmount,
                        text: key ,
                        name: 'Invoices',
                        mode: 'markers',
                        type: 'scatter',
                        marker: { size: 12 }
                      };
      let data = [seriesOne]
      return data
    } else {
    return [{
      name: 'Invoices',
      mode: 'markers',
      type: 'scatter'
    }]
    }
  }),
});
