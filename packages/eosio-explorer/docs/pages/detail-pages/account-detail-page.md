[Home](../..) > Account Detail Page

# Account Detail Page

The account detail page will allow you to search for accounts currently available on the blockchain, whether they come from an existing blockchain or were created using this tool. Users need to search for the account they wish to view the data for. 

## Search Account

In this panel, on the right hand side is a search bar allowing you to look up a specific account name. Simply type the name of the account in the input field and then click the "Search" button. If no account exists with the name you typed in, the page will inform you that no such account with that name exists. Otherwise, two new panels for the searched account will appear: "Account Detail" and "Account Raw JSON" panels.

## Account Detail

The account detail panel contains the basic information about a given account. This panel will display the following fields:
* Account name
* Account creation date
* Owner public key
* Active public key
* Smart contract (with a link to the corresponding [Smart Contract Detail Page](smart-contract-detail-page.md))

## Account Raw JSON

A panel containing a visualization of the raw JSON data of the account. This is taken directly from the currently connected MongoDB service. If you are currently connected to nodeos instances in a development environment, many of the fields here may contains values of `-1`.
