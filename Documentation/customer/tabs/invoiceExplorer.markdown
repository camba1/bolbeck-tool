## Customer - Invoice Explorer Tab

The Invoice explorer tab allows the user to graphically review customer invoices. By default, the tab diplays the invoices graphically in the top panel and as a grid in the bottom panel. When the user clicks an invoice on the graph, the details of the related invoice and its products are shown in the right half of the top pannel, as seen in the screenshot below.

![Invoice Explorer with Invoice selected](Documentation/images/InvoiceExplorerInvoiceView.png)

The invoice explorer shows invoices (purple circles), returns (purple squares) and their related products (blue circles). The user can click and drag any node as needed to explore the graph. Additionally, the user can select any number of nodes and drag them around the graph as needed.


The user can also click on a product in the graph and that will display all the invoices that contain the product as well as the product's detail in the right panel.

![Invoice Explorer with product selected](Documentation/images/InvoiceExplorerProductView.png)

The graph also has several options to help the user navigate the data.

### Graph Menu Bar

![Invoice Explorer Graph Menu Bar](Documentation/images/InvoiceExplorerGraphMenuBar.png)

The menu bar at the top of the graph provides the following options:

- Expand: Expands the graph by hiding the right panel
- Zoom: Allows the user to zoom into any area of the graph
- Menu: Displays additional options available for the graph. The options include:
  - Layout: Indicates how the system will try to automatically position the graph's nodes in the chart. The options include cose, circular, concentric, random and others.
  - Groups: Indicates whether the graph should draw all the data provided to the graph or wehther it should try to group the data before drawing the graph. Currently, the system can draw all products or it can group products that were sold in one or multiple invoices by product group
  - Invoice Label: Indicates what information will be shown on top of the invoice nodes. Currently it can show the invoice id or the invoice date (the later can be very useful when investigating time based purchasing pattern)
  - Auto-restyle after expand graph: indicates if the system should automatically re-draw the graph after the user hits the expand button in the menu bar.
  - Restyle button: Applies all option changes and re-draws the graph.

  The screenshot below shows the graph in a circular layout with the shared products grouping option applied.

![Invoice Explorer grouped and using circle layout](Documentation/images/InvoiceExplorerOpenMenuCircle.png)

### Node options popup menu

Beyond the options that apply to the graph as a whole, the individual graph nodes also have customizing options in the form of a circular menu that appears when the user clicks and holds the node.

![Menu Bar](Documentation/images/InvoiceExplorerGraphMenuBar.png)

The menu's options are dependent on the type of node the user clicks. Below is a description of each of the available options.


Option  |Node Type   |Description   |
--|---|---
Show  | All  |Shows any hidden nodes and edges associated with the currently selected node
Hide  | All |Hides the currently selected node and all associated edges. Adjacent nodes' border is changed to red to indicated that there are some hidden nodes.
Link  | All except grouped products  |Link to the master data details screen for the selected note (i.e.: Navigates to the products applicaton for the selected product)
Highlight  |  All |Currently selected node and its immediately adjacent nodes are highlighted while all other nodes and edges are made translucent and thus less visible
Expand  | Grouped nodes  | Expands all the products that are related to the selected group product node
