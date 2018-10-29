// This component renders basic plotly charts which include:
//scatter, bar and pie
import Component from '@ember/component';
import Plotly from 'plotly.js-basic-dist';

/**
 * Component to add plotly charts to application. Typical call:
   ```hbs
   {{chart/plotly-finance
     chartData=model
     chartLayout=chartLayout
     chartOptions = chartOptions
     chartEvent=(action "chartEvent")
   }}
   ```
 */
export default Component.extend({
  //rethrow the event but pass only the necesary information
  onPlotlyEvent: function(eventName, points){
    if (this.chartEvent) {
      let clickedPoints = points ? points.points : undefined
      this.chartEvent(eventName, clickedPoints);
    }
  },
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
    removePlotlyEvents(this);
    Plotly.newPlot(this.elementId, data, layout, options).then(() => {
      setupPlotlyEvents(this)
    });
  }
});

/**
 * List of events that this component will push up to the calling UI
 */
const selectedPlotlyEvents = [ 'click', 'legendclick', 'selected'].map(suffix => `plotly_${suffix}`);

/**
 * Setup listeners for events to the sent up to the calling UI
 * @param {object} mythis Reference to 'this' which in this case is the component
 */
function setupPlotlyEvents(mythis){
  selectedPlotlyEvents.forEach((eventName) => {
    mythis.element.on(eventName, (...args) => mythis.onPlotlyEvent(eventName, ...args));
  })
}
/**
 * Remove listeners for events to the sent up to the calling UI
 * @param {object} mythis Reference to 'this' which in this case is the component
 */
function removePlotlyEvents(mythis) {
     selectedPlotlyEvents.forEach(eventName => {
       // Note: Using plotly.js' 'removeListener' method (copied from EventEmitter)
       if (typeof mythis.element.removeListener === 'function') {
         mythis.element.removeListener(eventName, mythis.onPlotlyEvent);
       }
     });
   }
