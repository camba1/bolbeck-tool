import Component from '@ember/component';
import $ from 'jquery';
import { scheduleOnce } from '@ember/runloop';
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
  selectedLabels: null,
  nodesHidden: false,
  restyleAfterExpandGraph: false,
  prevLayout: null,
  cyUndoRedo : null,
  cyViewUtilities: null,
  // getLayout: name => Promise.resolve( layouts[ name ] ),
  //We need a global instance of the graph so that we can manipulate it later
  cy : cytoscape({container: $('#cy')[0] }),

  // when the user clicks on the graph or the menus, we can forward the events
  // upstream
  nodeClicked: function(clickedNodeKey, clickType, clickItemType) {
      this.onNodeClicked(clickedNodeKey, clickType, clickItemType);
  },
  menuClicked: function(clickedNodeKey, clickType, clickItemType, menuOptionName) {
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

      this.cyViewUtilities = this.cy.viewUtilities({
                               neighbor: function(node){
                                   return node.closedNeighborhood();
                               },
                               neighborSelectTime: 1000
                             });


     this.cyUndoRedo = this.cy.undoRedo();
     this.cyUndoRedo.action("thickenBorder", thickenBorder, thinBorder);
     this.cyUndoRedo.action("thinBorder", thinBorder, thickenBorder);

      //schedule for rendering
      scheduleOnce('afterRender', this, function(){
       this.cy;
     });

     //Define events we want to track
     //Menu events
     this.cy.on('click', (ele, itemKey, itemGroupName, itemType, menuOptiontName)=>{
       runMenuOptionClick(this, ele, itemKey, itemGroupName, itemType, menuOptiontName)
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
          Object.values(this.selectedLabels).forEach(function(value) {
            changeLabels(value)
          })
      }.bind(this) )
      //restyle the graph

    },
    setselectedLayout(selected){
      this.set('selectedLayout',selected)
    },
    setSelectedGroup(selected){
      this.set('selectedGroup',selected)
    },
    setNodeLabels(selected){
      changeLabels(this, selected)
    },
    showAllNodes(){
      showAllHiddenNodes(this.cy, this.cyUndoRedo, this)
    },
    areaZoom(){
      zoomToArea(this.cyViewUtilities)
    },
    expandGraph(){
      // this.onExpandGraphClicked()
      Promise.resolve(this.onExpandGraphClicked()).then(function() {
        this.cy.resize()
      }.bind(this)
     ).then(function() {
         if (this.restyleAfterExpandGraph) {
           let prevLayout = this.prevLayout;
           if( prevLayout ){
               prevLayout.stop();
             }

             let layout = prevLayout = this.cy.layout( {name: this.selectedLayout} );
             if (layout) {
               return layout.run().promiseOn('layoutstop');
             }
         }
       }.bind(this)
     )
    }
  }

});


// #region data loading

/**
 * Reset the groupMode, which causes the parent module to provide new data. Then,
   add the new data to the graph and trigger a restyle of the graph. Finally, trigger
   a post reload user exit so that the parent can do any last minute changes on it side
   @param Object thisComponent reference to the component (this)
 */
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
                     thisComponent.onPostReloadData()
                   }.bind(thisComponent) );
   }
 }

/**
 * Parent can provide either one array with both nodes and edges, or two separate
   arrays. This function combines them if necessary and returns a single Object.
   @param [Object] Optional. Nodes and edges to be plotted on the graph
   @param [Object] Optional. Nodes to be plotted on the graph
   @param [Object] Optional. Edges to be plotted on the graph
   @returns [Object] Combined nodes and edges to be plotted on the graph
 */
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
// #endregion

// #region  cxtMenu functions

/**
 * Build the menu to be attached to the ctxMenu. It used the options passed to
 * the component from the parent UI
 * @param {object[]} menuBuildingBlocks the menu options that were passed from the menuFromParentUI
 * UI to the component in the graphMenuOptions parameter.
 * @returns {object[]} menuOptions ready to be attached to the menu
 */
function getMenuOptions(menuBuildingBlocks){
  let menuOptions = [];
  if (menuBuildingBlocks) {
    menuOptions = menuBuildingBlocks.map(menuBuildingBlock => { return buildMenuOptions(menuBuildingBlock)} )
  }
  return menuOptions
}
/**
 * Builds the individual ctxMenu options based on the information passed from the
 * parent UI and the default values setup here.
 * @param {Object} menuBuildingBlock Values needed to setup the menus
 * @returns {object} cyMenuOptions configured menu option ready to be attached to the menu
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

/**
 * Receives a menu option click and forwards to the parent UI
   @param {Object} ele cytoscape object that was clicked
   @param {string} itemKey value that ids the element clicked as per the menu configuration
   @param {string} itemGroupName The group associated with the item clicked (node or edge)
   @param {string} itemtype Type of element clicked as per the element configuration
   @param {string} menuOptionName Name of the menu option that was clicked
   @param {object} thisComponent Refence to the calling component (this)
 */
function parentMenuOption (ele, itemKey, itemGroupName, itemType, menuOptiontName, thisComponent) {
  // Exec only of we called it
  if (itemKey) {
    let nodeOutDegree = ele.target.outdegree ? ele.target.outdegree(true) : 0 ;
    thisComponent.menuClicked(itemKey, itemGroupName, itemType, menuOptiontName, nodeOutDegree);
  }
}

function runExpandNodes(cy, thisComponent, ele, itemKey, itemGroupName, itemType, menuOptiontName){
  //run only for non-expanded elements
  //thisComponent.set('nodesExpansion', undefined)
  if (!ele.target.outdegree  || ele.target.outdegree(true) == 0) {
    parentMenuOption (ele, itemKey, itemGroupName, itemType, menuOptiontName, thisComponent)
    if (thisComponent.nodesExpansion && thisComponent.nodesExpansion.length > 0){
      cy.batch(function(){
        cy.add(thisComponent.nodesExpansion);
      });
    }
  }
}

function runMenuOptionClick(thisComponent, ele, itemKey, itemGroupName, itemType, menuOptiontName) {
  // Exec only of we called it
  if (itemKey) {
     switch (menuOptiontName) {
       case "hLight":
         highLightNeighbors(thisComponent.cy, thisComponent.cyUndoRedo, thisComponent);
         break;
       case "hide":
         hideSelectedNodes(thisComponent.cy, thisComponent);
         break
       case "show":
         showAdjecentNodes(thisComponent.cy, thisComponent)
         break
      case "expand":
         runExpandNodes(thisComponent.cy, thisComponent, ele, itemKey,
                        itemGroupName, itemType, menuOptiontName)
         break
       default:
         //Push the item up to the parent
         parentMenuOption (ele, itemKey, itemGroupName, itemType, menuOptiontName, thisComponent);
     }
  }
}

// #endregion

// #region hide show highlight zoom
// Increase border width to show nodes with hidden neighbors
function thickenBorder(eles){
  eles.forEach(function( ele ){
    var defaultBorderWidth = Number(ele.css("border-width").substring(0,ele.css("border-width").length-2));
    let newCSS = {"border-width" : `${defaultBorderWidth + 2}`, "border-color": "red" }
    // ele.css("border-width", defaultBorderWidth + 2);
    ele.css(newCSS);
  });
  eles.data("thickBorder", true);
  return eles;
}
// Decrease border width when hidden neighbors of the nodes become visible
function thinBorder(eles){
  eles.forEach(function( ele ){
    var defaultBorderWidth = Number(ele.css("border-width").substring(0,ele.css("border-width").length-2));
    let newCSS = {"border-width" : `${defaultBorderWidth - 2}`, "border-color": "black" }
    // ele.css("border-width", defaultBorderWidth - 2);
    ele.css(newCSS);
  });
  eles.removeData("thickBorder");
  return eles;
}

function highLightNeighbors (cy, cyUndoRedo, thisComponent) {
    if(!thisComponent.nodesHighlighted && cy.$(":selected").length > 0) {
        thisComponent.set('nodesHighlighted', true);
        cyUndoRedo.do("highlightNeighbors", cy.$(":selected"));
    } else {
      thisComponent.set('nodesHighlighted', false);
      removeHighLights (cyUndoRedo)
    }
}

function removeHighLights (cyUndoRedo) {
    cyUndoRedo.do("removeHighlights");
}

function hideSelectedNodes(cy, thisComponent){
    var actions = [];
    var nodesToHide = cy.$(":selected").add(cy.$(":selected").nodes().descendants());
    var nodesWithHiddenNeighbor = cy.edges(":hidden").connectedNodes().intersection(nodesToHide);
    actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
    actions.push({name: "hide", param: nodesToHide});
    nodesWithHiddenNeighbor = nodesToHide.neighborhood(":visible")
        .nodes().difference(nodesToHide).difference(cy.nodes("[thickBorder]"));
    actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
    cy.undoRedo().do("batch", actions);
    if (nodesToHide.length > 0) {
      thisComponent.set('nodesHidden', true)
    }
}

function showAdjecentNodes(cy, thisComponent) {
    var hiddenEles = cy.$(":selected").neighborhood().filter(':hidden');
    var actions = [];
    var nodesWithHiddenNeighbor = (hiddenEles.neighborhood(":visible").nodes("[thickBorder]"))
        .difference(cy.edges(":hidden").difference(hiddenEles.edges()
        .union(hiddenEles.nodes().connectedEdges())).connectedNodes());
    actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
    actions.push({name: "show", param: hiddenEles.union(hiddenEles.parent())});
    nodesWithHiddenNeighbor = hiddenEles.nodes().edgesWith(cy.nodes(":hidden").difference(hiddenEles.nodes()))
        .connectedNodes().intersection(hiddenEles.nodes());
    actions.push({name: "thickenBorder", param: nodesWithHiddenNeighbor});
    cy.undoRedo().do("batch", actions);
    if (cy.nodes("[thickBorder]").length == 0) {
      thisComponent.set('nodesHidden', false)
    }
}

function showAllHiddenNodes(cy, cyUndoRedo, thisComponent) {
    var actions = [];
    var nodesWithHiddenNeighbor = cy.nodes("[thickBorder]");
    actions.push({name: "thinBorder", param: nodesWithHiddenNeighbor});
    actions.push({name: "show", param: cy.elements()});
    cyUndoRedo.do("batch", actions);
    thisComponent.set('nodesHidden', false)
}

function zoomToArea(cyViewUtilities) {
  cyViewUtilities.enableMarqueeZoom();
}

// #endregion

function changeLabels(thisComponent, selected){
  if (selected) {
    let nodeClasses = selected.split(".");
    if (nodeClasses && nodeClasses.length == 3) {
        if (!thisComponent.selectedLabels) {
          thisComponent.selectedLabels = {}
        }
        thisComponent.selectedLabels[`${nodeClasses[0]}`] = selected
        thisComponent.cy.nodes("node").removeClass(nodeClasses[2]).addClass(nodeClasses[1])
    }
  }
}
