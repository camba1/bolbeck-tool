import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';
// import query from 'ember-gui/gql/queries/product/prodHierarchy';
import { ComponentQueryManager } from 'ember-apollo-client';
// import cxtmenu from 'cytoscape-menu';

/*global cytoscape*/
export default Component.extend(ComponentQueryManager, {
  tagName: '',
  //We need a global instance of the graph so that we can manipulate it later
  cy : cytoscape({container: $('#cy')[0] }),
  //when the user clicks on the graph or the menus, we can forward the events
  //upstream
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

/**
 * Get data from the DB when the user wants to expand a new node (Expand option on ctxMenu)
 * Then, add the data to nodes and edges of the graph (dups are ignored) and trigger
 * an afterexpand event that can be handled upstream
 * @param {String} sourceNodeKey key of the node that the user requested to expand
 * @param {object} apollo refrence to the apollo service used to get the data from backend
 * @param {String} apolloQueryId Identifier used by apollo to pull the data
 * @param {object} queryHierarchy gql query object used to pull the data
 * @param {object} cy reference to the graph to which we need to add the new dataset
 * @param {String} clickType indicates wether the user clicked on nodes or edges. Will be forwarded
 * upstream to help any additional preocessing
 * @param {String} menuOptionName Indicates which menu option the user clicked. Will be forwarded
 * upstream to help any additional preocessing
 * @param {String} bottomHierarchyLevel string indicating the lowest level of the hierarchy, passed
 * into the component in parameter bottonHierarchyLevel. Used to properly attach nodes to graph
 */
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

/**
 * Adds the  relationship edges to the array of values that will be used to populate the graph.
 * @param {object} modelData Contains info for the nodes. Must include e_key, eFrom & eTo
 * @returns {object} nodes ready to be attached to the graph dataset.
 */
function addEdgesToArray(modelData){
  let edges = modelData.map( row => {
    return   { group: "edges", data: { id: row.e_key,
                                source: row.eFrom,
                                target: row.eTo,
                                key: row.e_key } }
  });
  return edges
}

/**
 * Adds the  nodes to the array of values that will be used to populate the graph.
 * The bottom of the hierarchy node will have a different class (denoted by the bottomHierarchyLevel
 * parameter passed from the parent UI) than the rest of the data nodes which will have class 'hier'
 * to allow custom style
 * @param {object} modelData Contains info for the nodes. Must include id, name & _key
 * @returns {object} nodes ready to be attached to the graph dataset.
 */
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

/**
 * Adds the root node to the array of values that will be used to populate the graph.
 * The root node will have a different class ('root') than the rest of the data nodes
 * to allow custom style
 * @param {object} modelData Contains info for the root node. Must include id, name & _key
 * @returns {object} node ready to be attached to the graph dataset.
 */
function addRootNodeToArray(modelData){
  let firstNode= [];
  firstNode.push({ group: "nodes", data: { id: modelData._id,
                    name: modelData.name,
                    key: modelData._key,
                  }, classes: 'root' });
  return firstNode;
}

/**
 * Gets the layout to be used by the graph
 * @param {object} layoutFromParentUI Layout passed by parent UI in parameter graphLayout
 * @returns {object} Parent layout if available,  default layout otherwise
 */
function getGraphLayout(layoutFromParentUI) {
  let layout = layoutFromParentUI ? layoutFromParentUI :
                {
                  name: 'breadthfirst'
                };
  return layout
}
/**
 * Build the graph style by using either a graph style passed by the parent UI in the parameter
 * 'graphStyle' or uses a default graph style
 * @param {object} styleFromParentUI Style passed by the parent UI in the parameter
 * 'graphStyle'
 * @param {String} bottomHierarchyLevel string indicating the lowest level of the hierarchy, passed
 * into the component in parameter bottonHierarchyLevel
 * @returns {object} Style ready to attach to the menu
 */
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

/**
 * Gets the menu options to be attached to the ctxMenu. It can either use the default
 * options or used the ones passed to the component from the parent UI
 * @param {object} menuFromParentUI the menu options that were passed from the menuFromParentUI
 * UI to the component in the graphMenuOptions parameter. This will be used instead of the default
 * menu items
 * @param {String} menuSelector Used to buid the default menu so that specific items are attached
 * to the bottom of the hierarchy. Not use for customer menu options
 * @returns {object} menuOptions ready to be attached to the menu
 */
function getMenuOptions(menuFromParentUI, menuSelector){
  let menuOptions = menuFromParentUI ? menuFromParentUI :
                    [buildMenuOptions(menuSelector, false),
                     buildMenuOptions('node.hier', true)];
  return menuOptions
}
/**
 * Builds a default menu  for the ctxmenu of cytoscape. Currently
 * the options are:
 * - 'Go' which sends the link command along with the id of the element clicked
 *    so we may navigate to the detail page of the element
 * - 'Exp' which expands the clicked element by bringing more data from the db
 *    and adding it to the graph
 * @param {String} menuSelector The selection criteria on which nodes to attach the menu options
 * @param {Boolean} enableSecondCommand Indicates wether the expand option should be enabled
 * @returns {object} cyMenuOptions Configured menu options ready to be attached to the menu
 */
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
