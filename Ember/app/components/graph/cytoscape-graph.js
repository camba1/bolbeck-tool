import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';
// import cxtmenu from 'cytoscape-menu';

/*global cytoscape*/
export default Component.extend({
  tagName: '',
  nodeClicked: function(clickedNodeKey, clickType) {
    this.onNodeClicked(clickedNodeKey, clickType);
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
      let node = { group: "nodes", data: { id: row._id,
                    name: row.name,
                    key: row._key } }
      row.hierarchyLevel == 'sku'? node.classes = 'sku': ''
      return node
    });
    let edges = myModel.map( row => {
      return   { group: "edges", data: { id: row.e_key,
                                  source: row.eFrom,
                                  target: row.eTo,
                                  key: row.e_key } }
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
    let cyMenuOptions = {
                      selector: 'node, edge',
                       menuRadius: 60,
                      commands: [
                        {
                          content: 'One',
                          select: function(ele){
                            console.log( 'there');
                          }
                        },
                        // {
                        //   content: 'Two',
                        //   select: function(ele){
                        //     console.log( 'gere' );
                        //   },
                        //   enabled: true
                        // },
                        // {
                        //   content: 'Four',
                        //   select: function(ele){
                        //     console.log( 'ere' );
                        //   }
                        // },
                        {
                          content: 'Three',
                          select: function(ele){
                            console.log( 'everywhere' );
                          }
                        }
                      ],
                      spotlightPadding: 2,
                      activePadding: 10,
                      indicatorSize: 18,
                      minSpotlightRadius: 15,
                      maxSpotlightRadius: 25
    };

    var cy = cytoscape({
      container: $('#cy')[0],
      elements: customNodesAndEdges,
       layout: customLayout,
       style: customStyle
      });

    let menu =  cy.cxtmenu(cyMenuOptions);

      scheduleOnce('afterRender', this, function(){
       cy;
     });
     cy.on('click', 'node', (evt)=>{
        this.nodeClicked(evt.target.data('key'), 'node');
      });
      cy.on('click', 'edge', (evt)=>{
         this.nodeClicked(evt.target.data('key'),'edge');
       });
  }
});
