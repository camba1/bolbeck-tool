import Component from '@ember/component';
import Plotly from 'plotly.js-basic-dist';


export default Component.extend({
  didInsertElement() {
    const data = this.chartData ? this.chartData : [] ;
    const layout = this.chartLayout ? this.chartLayout : {};
    let options
    if (this.chartOptions) {
      options = this.chartOptions;
      options.displaylogo = false;
      options.responsive = true;
      options.modeBarButtonsToRemove ? options.modeBarButtonsToRemove.push('sendDataToCloud') :
                                      options.modeBarButtonsToRemove = ['sendDataToCloud']
    } else {
      options =  {displaylogo: false,
                  responsive: true,
                  modeBarButtonsToRemove: ['sendDataToCloud']};
    }
    Plotly.newPlot(this.elementId, data, layout, options);
  }
});
