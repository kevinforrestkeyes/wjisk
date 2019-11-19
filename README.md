# project overview

wjisk is a web app for taking product data that has been uploaded to [Depop](https://www.depop.com/) and transferring it to a store on [Shopify](https://shopify.com/). it can be tedious to try to maintain parity between the two platforms as there are no existing tools for moving data between them. i wanted to create a simple application to bridge the gap between these platforms and allow the user some control over how the products were being processed as they move from Depop to Shopify. this repository is only the front end of this application, and is supported by several other applications that i built specifically to facilitate this process. 

## this repository

this front-end was built using React, and allows the user initiate new scrapes of product data from their Depop store, view the resulting products, select products to be uploaded to Shopify, then edit the products' data individually before sending the products to be uploaded to Shopify. the user can also view their products currently listed on Shopify.

## supporting applications

* [anpoorte](https://github.com/kevinforrestkeyes/anpoorte)
* [popwizard](https://github.com/kevinforrestkeyes/popwizard)
