## Customer - Invoice Dashboard

![Invoice Dashboard](Documentation/images/InvoiceDashboard.png)

The invoice dashboard provides a quick look at the overal sales to a particular customer.  The dashboard is divided into four sections as described below:

#### Sales Summary

The sales summary provides a glance at the sales for a particular customer. It provides 3 key figures that should be of interest to the sales rep:

- _Number of invoices_ posted for the customer
- _Number of Products sold_ to the customer
- _Net Sales Amount_

#### Invoice Details

This section provides a graphical reprensentation of the invoices for the customer. It includes four interactive  (zoom, selection, download, etc...) charts. Going from top left to bottom right, the four charts display:

- _Sales Amount per invoice and time period_ displays the sales amount time for individual invoices in a given time period. Note that the user can zoom in/out to display different time frames (year/month/day)
- _Number of Products sold per time period_ shows how many products where sold in a given time period. One can use this chart in conjunction with the _Amount per time period_ to identitfy high price products sold with little volume vs low priced products at high volume. Note that the chart allos interactive zoom to display different time frames (year/month/day)
- _Cumulative sales per time period_ presents aggregated sales informaton for a given time period. This chart is usefull to identify sales trends. Similar to the other charts above, it allow dynamic zooming based on the time frame desired.
- _Sales vs. Returns_ represents the amounts of sales amounts vs return amounts in a give time frame.

#### Sales vs. Returns

The sales vs returns section provides a quick and easy read out on the overal health of the sales channel. Having a significant number of returns vs sales could potentially represent a high number of defects in the products or products that do not meet customer expectations.

#### Invoice Listing

The final section of the invoice dashboard display a grid based listing of the invoices for the customer.
