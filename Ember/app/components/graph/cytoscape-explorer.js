import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce, next } from '@ember/runloop';
import { ComponentQueryManager } from 'ember-apollo-client';

/*global cytoscape*/
export default Component.extend(ComponentQueryManager, {
  init() {
    this._super(...arguments);
    this.graphLayouts = [{value: 'cose', label:'Cose' },
                   {value: 'breadthfirst', label: 'Breadth First' },
                   {value: 'circle', label: 'Circle'},
                   {value: 'concentric', label: 'Concentric'},
                   {value: 'grid', label: 'Grid'},
                   {value: 'random', label: 'Random'}];
    this.graphGroupings= [{value: 'none', label: 'None'},
                          {value: 'prod', label: 'Products'},
                          {value: 'sharedProd', label: 'Shared products'}]
  },
  tagName: '',
  selectedLayout: null,
  selectedGroup: null,
  prevLayout: null,
  getLayout: name => Promise.resolve( layouts[ name ] ),
  //We need a global instance of the graph so that we can manipulate it later
  cy : cytoscape({container: $('#cy')[0] }),

  // when the user clicks on the graph or the menus, we can forward the events
  // upstream
  nodeClicked: function(clickedNodeKey, clickType, clickItemType) {
      this.onNodeClicked(clickedNodeKey, clickType, clickItemType);
  },
  menuClicked: function(clickedNodeKey, clickType, clickItemType, menuOptionName, nodeOutDegree) {
      this.onMenuClicked(clickedNodeKey, clickType, clickItemType, menuOptionName);
  },

  didInsertElement: function() {
    this._super();
    //set the layout and group in the properties associated with the layout drop downs
    this.selectedLayout = this.graphLayout.name
    this.selectedGroup = this.graphGroupMode
    //Load data obtained from parent
    let customNodesAndEdges = getNodesAndEdgesForGraph(this.nodesAndEdges, this.nodes, this.edges)
    //declare graph layout
    let customLayout = this.graphLayout;
    //declare graph style
    let customStyle = this.graphStyle;
    //build menu options
    let menuOptions = getMenuOptions(this.graphMenuOptions)
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
     this.cy.on('click', (ele, itemKey, itemGroupName, itemType, menuOptiontName)=>{
         // Exec only of we called it
         if (itemKey) {
           let nodeOutDegree = ele.target.outdegree ? ele.target.outdegree(true) : 0 ;
           this.menuClicked(itemKey, itemGroupName, itemType, menuOptiontName, nodeOutDegree);
         }
      });
  //    //graph events
     this.cy.on('click', 'node', (evt)=>{
        this.nodeClicked(evt.target.data('key'), evt.target.group(), evt.target.data('type') ) ;
      });
      this.cy.on('click', 'edge', (evt)=>{
         this.nodeClicked(evt.target.data('key'),evt.target.group(), evt.target.data('type'));
       });
  },
  actions: {
    restyle(){
      //reload data if needed
      Promise.resolve(reLoadData(this)).then(function() {
        //Setup the style
        let prevLayout = this.prevLayout;
        if( prevLayout ){
            prevLayout.stop();
          }

          let layout = prevLayout = this.cy.layout( {name: this.selectedLayout} );
          if (layout) {
            return layout.run().promiseOn('layoutstop');
          }
      }.bind(this) )
      //restyle the graph

    },
    setselectedLayout(selected){
      this.set('selectedLayout',selected)
    },
    setSelectedGroup(selected){
      this.set('selectedGroup',selected)
    }
  }

});


 function reLoadData(thisComponent){
   if (thisComponent.selectedGroup != thisComponent.graphGroupMode) {
     Promise.resolve( thisComponent.set('graphGroupMode',thisComponent.selectedGroup)).then( function() {
                     let customNodesAndEdges = getNodesAndEdgesForGraph(thisComponent.nodesAndEdges,
                                                                       thisComponent.nodes,
                                                                       thisComponent.edges)
                     // so new eles are offscreen
                     thisComponent.cy.zoom(0.001);
                     thisComponent.cy.pan({ x: -9999999, y: -9999999 });

                     // replace eles
                     thisComponent.cy.elements().remove();
                     thisComponent.cy.add( customNodesAndEdges );
                   }.bind(thisComponent) );
   }
 }


 function getNodesAndEdgesForGraph(nodesAndEdges,nodes,edges){
   let customNodesAndEdges = [];
   if (nodesAndEdges) {
     customNodesAndEdges = nodesAndEdges
    }
   else {
     customNodesAndEdges = [...nodes, ...edges];
   }
   return customNodesAndEdges
}

/**
 * Adds the  relationship edges to the array of values that will be used to populate the graph.
 * @param {object} modelData Contains info for the nodes. Must include e_key, eFrom & eTo
 * @returns {object} nodes ready to be attached to the graph dataset.
 */
// function addEdgesToArray(modelData){
//   let edges = modelData.map( row => {
//     return   { group: "edges", data: { id: row.e_key,
//                                 source: row.eFrom,
//                                 target: row.eTo,
//                                 key: row.e_key } }
//   });
//   return edges
// }

/**
 * Adds the  nodes to the array of values that will be used to populate the graph.
 * The bottom of the hierarchy node will have a different class (denoted by the bottomHierarchyLevel
 * parameter passed from the parent UI) than the rest of the data nodes which will have class 'hier'
 * to allow custom style
 * @param {object} modelData Contains info for the nodes. Must include id, name & _key
 * @returns {object} nodes ready to be attached to the graph dataset.
 */
//  function addNodesToArray(modelData, bottonHierarchyLevel){
//   let nodes = modelData.map(row => {
//       let node = { group: "nodes", data: { id: row._id,
//                     name: row.name,
//                     key: row._key } }
//       node.classes = row.hierarchyLevel == bottonHierarchyLevel ? bottonHierarchyLevel: 'hier'
//       return node
//     });
//     return nodes
// }

/**
 * Adds the root node to the array of values that will be used to populate the graph.
 * The root node will have a different class ('root') than the rest of the data nodes
 * to allow custom style
 * @param {object} modelData Contains info for the root node. Must include id, name & _key
 * @returns {object} node ready to be attached to the graph dataset.
 */
// function addRootNodeToArray(modelData){
//   let firstNode= [];
//   firstNode.push({ group: "nodes", data: { id: modelData._id,
//                     name: modelData.name,
//                     key: modelData._key,
//                   }, classes: 'root' });
//   return firstNode;
// }

/**
 * Gets the layout to be used by the graph
 * @param {object} layoutFromParentUI Layout passed by parent UI in parameter graphLayout
 * @returns {object} Parent layout if available,  default layout otherwise
 */
// function getGraphLayout(layoutFromParentUI) {
//   let layout = layoutFromParentUI ? layoutFromParentUI :
//                 {
//                   name: 'breadthfirst'
//                 };
//   return layout
// }
/**
 * Build the graph style by using either a graph style passed by the parent UI in the parameter
 * 'graphStyle' or uses a default graph style
 * @param {object} styleFromParentUI Style passed by the parent UI in the parameter
 * 'graphStyle'
 * @param {String} bottomHierarchyLevel string indicating the lowest level of the hierarchy, passed
 * into the component in parameter bottonHierarchyLevel
 * @returns {object} Style ready to attach to the menu
 */
// function getGraphStyle(styleFromParentUI, bottonHierarchyLevel){
//   let customStyle = [
//                       {
//                         selector: 'node',
//                         style: {
//                           'label': 'data(key)'
//                           //'font-size': 10
//                         }
//                       },
//                       {
//                         selector: 'node.root',
//                         style: {
//                           'label': 'data(name)',
//                            'shape': 'triangle',
//                            'background-color': '#6FB1FC'
//                         }
//                       },
//                       {
//                         selector: `node.${bottonHierarchyLevel}`,
//                         style: {
//                            'shape': 'diamond'
//                         }
//                       },
//                       {
//                         selector: 'edge',
//                         style: {
//                           'curve-style': 'bezier',
//                           'opacity': 0.667,
//                           'target-arrow-shape': 'triangle'
//                         }
//                       }
//                     ];
//     let style = styleFromParentUI ? styleFromParentUI : customStyle;
//     return style
// }

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
function getMenuOptions(menuBuildingBlocks){
  let menuOptions = [];
  if (menuBuildingBlocks) {
    menuOptions = menuBuildingBlocks.map(menuBuildingBlock => { return buildMenuOptions(menuBuildingBlock)} )
  }
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
function buildMenuOptions(menuBuildingBlock){

  let cyMenuCommands = menuBuildingBlock.menuItems.map(menuItem => {
                                      return  {
                                            content: menuItem.content,
                                            select: function(ele){
                                                ele.emit('click',
                                                [ele.data(`${menuItem.dataReturnField}`),
                                                ele.group(),
                                                ele.data('type'),
                                                `${menuItem.menuItemId}`]);
                                              }
                                          }
                                        })
    let cyMenuOptions = {
                      selector: menuBuildingBlock.menuSelector,//'node.sku',//, edge',
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
