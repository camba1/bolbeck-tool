//his component renders geo plotly charts which include:
//scatter, scattergeo and choropleth

import Component from '@ember/component';
import Plotly from 'plotly.js-geo-dist';

export default Component.extend({
  // attributeBindings: ['customid:id'],
  // customid: 'geoplot',
  didInsertElement() {
    // Plotly.d3.csv('https://raw.githubusercontent.com/plotly/datasets/master/2011_february_us_airport_traffic.csv', function(err, rows){
    //
    //     function unpack(rows, key) {
    //         return rows.map(function(row) { return row[key]; });
    //     }
    //
    //     var scl = [[0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],[0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],[0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']];
    //
    //     var data = [{
    //         type:'scattergeo',
    //         locationmode: 'USA-states',
    //         lon: unpack(rows, 'long'),
    //         lat: unpack(rows, 'lat'),
    //         hoverinfor:  unpack(rows, 'airport'),
    //         text:  unpack(rows, 'airport'),
    //         mode: 'markers',
    //         marker: {
    //             size: 8,
    //             opacity: 0.8,
    //             reversescale: true,
    //             autocolorscale: false,
    //             symbol: 'square',
    //             line: {
    //                 width: 1,
    //                 color: 'rgb(102,102,102)'
    //             },
    //             colorscale: scl,
    //             cmin: 0,
    //             color: unpack(rows, 'cnt'),
    //             colorbar: {
    //                 title: 'Incoming Flights February 2011'
    //             }
    //         }
    //     }];
    //
    //
    //     const layout = {
    //         title: 'Most Trafficked US airports',
    //         colorbar: true,
    //         geo: {
    //             scope: 'usa',
    //             projection: {
    //                 type: 'albers usa'
    //             },
    //             showland: true,
    //             landcolor: 'rgb(250,250,250)',
    //             subunitcolor: 'rgb(217,217,217)',
    //             countrycolor: 'rgb(217,217,217)',
    //             countrywidth: 0.5,
    //             subunitwidth: 0.5
    //         }
    //     };
    //
    //     const options = {displaylogo: false,
    //                     showLink: false};
    //     var geodiv = $('#geoplot')[0];
    //     Plotly.plot(geodiv, data, layout, options);
  // }
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
