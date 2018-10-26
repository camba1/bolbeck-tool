// This component renders cartesian plotly charts which include:
//scatter, bar, box, heatmap, histogram, histogram2d, histogram2dcontour,
//pie, contour, scatterternary and violin

import Component from '@ember/component';
import Plotly from 'plotly.js-cartesian-dist';

export default Component.extend({
  didInsertElement() {
    // var y = [];
    // for (var i = 0; i < 500; i ++) {
    //   y[i] = Math.random();
    // }
    //
    // var data = [
    //   {
    //     y: y,
    //     type: 'histogram',
    //     color: "rgba(100, 200, 102, 0.5)",
    //   }
    // ];
    // const layout = {bargap: 0.05};
    // const options = {displaylogo: false,
    //                 responsive: true};
    // Plotly.newPlot(this.elementId, data, layout, options);
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
