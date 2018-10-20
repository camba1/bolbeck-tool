import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';

/*global cytoscape*/
export default Component.extend({
  tagName: '',
  clickedNodeKey:{},
  nodeClicked: function(clickedNode) {
    this.clickedNodeKey.key= clickedNode.data('key');
    this.onNodeClicked(clickedNode.data('key'));
  },

  didInsertElement: function() {
    this._super();
    let myModel = this.model;
    let rootModel = this.rootModel[0];
    let firstNode= [];
    //Add source node
    firstNode.push({ group: "nodes", data: { id: "product/".concat(rootModel._key),
                      name: rootModel.name,
                      key: rootModel._key,
                      }, classes: 'root' })
    let nodes = myModel.map(row => {
      let node = { group: "nodes", data: { id: row._id, name: row.name, key: row._key } }
      row.hierarchyLevel == 'sku'? node.classes = 'sku': ''
      return node
    });
    let edges = myModel.map( row => {
      return   { group: "edges", data: { id: row.e_key, source: row.eFrom, target: row.eTo } }
    });
    let customNodesAndEdges = [...firstNode,...nodes, ...edges];
    let customLayout = {
                          name: 'breadthfirst'
                        };
    let customStyle = [
                        {
                          selector: 'node',
                          style: {
                            'label': 'data(key)'
                            //'font-size': 10
                          }
                        },
                        {
                          selector: 'node.root',
                          style: {
                            'label': 'data(name)',
                             'shape': 'triangle',
                             'background-color': '#6FB1FC'
                          }
                        },
                        {
                          selector: 'node.sku',
                          style: {
                             'shape': 'diamond'
                          }
                        }
                      ];

    var cy = cytoscape({
      container: $('#cy')[0],
      elements: customNodesAndEdges,
        layout: customLayout,
        style: customStyle
      });
      scheduleOnce('afterRender', this, function(){
       cy;
     });
     cy.on('click', 'node', (evt)=>{
        var clickedNode = evt.target;
        this.nodeClicked(clickedNode);
      });
  }
});
