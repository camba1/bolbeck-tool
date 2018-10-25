import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';
// import query from 'ember-gui/gql/queries/product/prodHierarchy';
import { ComponentQueryManager } from 'ember-apollo-client';
// import cxtmenu from 'cytoscape-menu';

/*global cytoscape*/
export default Component.extend(ComponentQueryManager, {
  tagName: '',
  cy : cytoscape({container: $('#cy')[0] }),
  nodeClicked: function(clickedNodeKey, clickType, menuOptionName, newData) {
    if (menuOptionName == 'expand') {
      getNewData(clickedNodeKey, this.get('apollo'), this.apolloQueryId,
                          this.queryHierarchy, this.cy,
                          clickType, menuOptionName, this.bottonHierarchyLevel);
    } else {
      this.onNodeClicked(clickedNodeKey, clickType, menuOptionName, newData);
    }
  },

  didInsertElement: function() {
    this._super();
    let myModel = this.model;
    let rootModel = this.rootModel[0];
    // //Add source node
    let firstNode = addRootNodeToArray(rootModel);
    //Add all other nodes
    let nodes = addNodesToArray(myModel, this.bottonHierarchyLevel);
    //Add the relationship edges
    let edges = addEdgesToArray(myModel);
    //Combine node and edges
    let customNodesAndEdges = [...firstNode,...nodes, ...edges];
    //declare graph layout
    let customLayout = getGraphLayout(this.graphLayout);
    //declare graph style
    let customStyle = getGraphStyle(this.graphStyle, this.bottonHierarchyLevel);
    //build menu options
    let menuOptions = getMenuOptions(this.graphMenuOptions, `node.${this.bottonHierarchyLevel}`)

    //initialize graph
     this.cy = cytoscape({
      container: $('#cy')[0],
      elements: customNodesAndEdges,
       layout: customLayout,
       style: customStyle
      });

      //initialize graph menus
      if (menuOptions) {
          menuOptions.forEach((option) => { this.cy.cxtmenu(option) });
      }

      //schedule for rendering
      scheduleOnce('afterRender', this, function(){
       this.cy;
     });

     //Define events we want to track
     //Menu event
     this.cy.on('click', (ele, itemKey, itemGroupName, menuOptiontName, newData)=>{
         // Exec only of we called it
         if (itemKey) {
           this.nodeClicked(itemKey, itemGroupName, menuOptiontName, newData);
         }
      });
     //graph events
     this.cy.on('click', 'node', (evt)=>{
        this.nodeClicked(evt.target.data('key'), evt.target.group());
      });
      this.cy.on('click', 'edge', (evt)=>{
         this.nodeClicked(evt.target.data('key'),evt.target.group());
       });
  }
});


 function getNewData(sourceNodeKey, apollo, apolloQueryId,
                    queryHierarchy, cy, clickType, menuOptionName,
                    bottonHierarchyLevel){
  let variables = {input: {_key: sourceNodeKey, direction: "outbound", maxDepth: 2 }};
    return apollo.query({ query: queryHierarchy, variables }, apolloQueryId).then((result) => {
        let nodes = addNodesToArray(result, bottonHierarchyLevel);
        let edges = addEdgesToArray(result);
        cy.batch(function(){
          cy.add([...nodes, ...edges]);
        });
        cy.layout({ name: 'breadthfirst' }).run();
        cy.emit('click', [sourceNodeKey, clickType, `after${menuOptionName}`, result])
    });
}

function addEdgesToArray(modelData){
  let edges = modelData.map( row => {
    return   { group: "edges", data: { id: row.e_key,
                                source: row.eFrom,
                                target: row.eTo,
                                key: row.e_key } }
  });
  return edges
}

function addNodesToArray(modelData, bottonHierarchyLevel){
  let nodes = modelData.map(row => {
      let node = { group: "nodes", data: { id: row._id,
                    name: row.name,
                    key: row._key } }
      node.classes = row.hierarchyLevel == bottonHierarchyLevel ? bottonHierarchyLevel: 'hier'
      return node
    });
    return nodes
}

function addRootNodeToArray(modelData){
  let firstNode= [];
  firstNode.push({ group: "nodes", data: { id: modelData._id,
                    name: modelData.name,
                    key: modelData._key,
                  }, classes: 'root' });
  return firstNode;
}

function getGraphLayout(layoutFromParentUI) {
  let layout = layoutFromParentUI ? layoutFromParentUI :
                {
                  name: 'breadthfirst'
                };
  return layout
}

function getGraphStyle(styleFromParentUI, bottonHierarchyLevel){
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
                        selector: `node.${bottonHierarchyLevel}`,
                        style: {
                           'shape': 'diamond'
                        }
                      },
                      {
                        selector: 'edge',
                        style: {
                          'curve-style': 'bezier',
                          'opacity': 0.667,
                          'target-arrow-shape': 'triangle'
                        }
                      }
                    ];
    let style = styleFromParentUI ? styleFromParentUI : customStyle;
    return style
}

function getMenuOptions(menuFromParentUI, menuSelector){
  let menuOptions = menuFromParentUI ? menuFromParentUI :
                    [buildMenuOptions(menuSelector, false),
                     buildMenuOptions('node.hier', true)];
  return menuOptions
}

function buildMenuOptions(menuSelector, enableSecondCommand){

  let cyMenuCommands = [
                            {
                              content: 'Go',
                              select: function(ele){
                                ele.emit('click', [ele.data('key'), ele.group(), 'link']);
                              }
                            },
                            {
                              content: 'Exp',
                              select: function(ele){
                                ele.emit('click', [ele.data('key'), ele.group(), 'expand']);
                              },
                              enabled: enableSecondCommand
                            }
                        ]   ;
  let cyMenuOptions = {
                    selector: menuSelector,//'node.sku',//, edge',
                    menuRadius: 60,
                    commands: cyMenuCommands,
                    spotlightPadding: 2,
                    activePadding: 10,
                    indicatorSize: 18,
                    minSpotlightRadius: 15,
                    maxSpotlightRadius: 25
  };
  return cyMenuOptions
}
