import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { sort } from '@ember/object/computed';

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.chartLayout = {title: 'Invoice Dashboard',
                          bargap: 0.03,
                          grid: {rows: 3,
                                  columns: 1,
                                  pattern: 'independent'
                                },
                          xaxis3: {
                                  title: 'Date'
                                  },
                          yaxis: {
                                  title: 'Amount'
                                },
                          yaxis2: {
                                  title: 'No. of Prods'
                                },
                          yaxis3: {
                                  title: 'Amount'
                                },
                        }
  },
  chartDatas: computed('model', function() {
    if (this.get('model')) {
      let model = this.get('model');
      model.sort(function(a,b) {return new Date(a.invoiceDate) - new Date(b.invoiceDate)})
      let invoiceDate = model.map(a => new Date(a.invoiceDate) );
      let totAmount = model.map(a => a.totAmount );
      let numberOfProds = model.map(a => a.numberOfProds);
      let key = model.map(a => a._key );
      debugger;
      let dateRange = [addDays(invoiceDate[0], -1), addDays(invoiceDate[invoiceDate.length - 1], 1)]
      let binRange = [new Date(dateRange[0].getFullYear()-1 ,11,31), new Date(dateRange[1].getFullYear(), 11,31)]
      let yRange = [totAmount.reduce((a, b) => Math.min(a, b)) -1, totAmount.reduce((a, b) => Math.max(a, b))+ 1]

      let seriesOne = {
                        x: invoiceDate,
                        y: totAmount,
                        text: key ,
                        name: 'Amt/Invoice',
                        mode: 'markers',
                        type: 'scatter',
                        marker: { size: 8 }
                      };
      let seriesTwo = {
                        x: invoiceDate,
                        y: numberOfProds,
                        text: key ,
                        name: 'No. Prods/ Invoice',
                        mode: 'markers',
                        type: 'scatter',
                        xaxis: 'x2',
                        yaxis: 'y2',
                        marker: { size: 8 }
                      };
        let seriesThree = {
                        histfunc: "sum",
                        x: invoiceDate,
                        y: totAmount,
                        xaxis: 'x3',
                        yaxis: 'y3',
                        type: "histogram",
                        name: "Tot. Amount"
                      }
       let data = [seriesOne, seriesTwo,seriesThree]
      //let data = [seriesThree]
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
function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
