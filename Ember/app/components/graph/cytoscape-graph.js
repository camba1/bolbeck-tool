import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';

/*global cytoscape*/
export default Component.extend({
  tagName: '',

  didInsertElement: function() {
    this._super();
    debugger
    let myModel = this.model;
    let edges = myModel.map( row => {
      return { group: "edges", data: { id: row.e_key, source: row.eFrom, target: row.eTo } }
    });
    let nodes = myModel.map(row => {
      return { group: "nodes", data: { id: "product/".concat(row._key) } }
    });
    //Add source node
    nodes.push({ group: "nodes", data: { id: "product/".concat("845303") } })
    var cy = cytoscape({
      container: $('#cy')[0],
      elements: [...nodes, ...edges],
      // elements: [ // list of graph elements to start with
      //     { // node a
      //       data: { id: 'a' }
      //     },
      //     { // node b
      //       data: { id: 'b' }
      //     },
      //     { // node b
      //       data: { id: 'c' }
      //     },
      //     { // edge ab
      //       data: { id: 'ab', source: 'a', target: 'b' }
      //     }
      //   ],
        layout: {
          name: 'breadthfirst'
        },

        // so we can see the ids
        style: [
          {
            selector: 'node',
            style: {
              'content': 'data(id)'
            }
          }
        ]
      });
      scheduleOnce('afterRender', this, function(){
       cy;
     });
  }
});
