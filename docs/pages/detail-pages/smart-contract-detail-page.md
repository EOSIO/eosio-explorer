[Home](../..) > Smart Contract Detail Page

# Smart Contract Detail Page

The smart contract page will allow you to search for smart contract associated with accounts currently available on the blockchain. Users need to search for the account they wish to view the smart contract for, since accounts have a one-to-one correspondence with a smart contract. However, be aware that newly created accounts are likely to not yet have smart contracts associated with them.

:warning: Disclaimer :warning:

When a smart contract is deployed under an account, the name of the smart contract takes the name of the account which deployed it. Keep this in mind when searching for smart contracts.

## Search Smart Contract

In this panel, on the right hand side is a search bar allowing you to look up a specific smart contract name. The smart contract name should be the same name as an account on the blockchain. You can use the [Account Detail Page](account-detail-page.md) as a reference. If no smart contract exists with the name you typed in, the page will inform you that no such smart contract with that name exists. Otherwise, one will appear: Smart Contract Detail. If the smart contract contains multi-index tables, a dropdown menu containing the list of tables associated with the smart contract will appear below the newly displayed panel on the left hand side.

## Smart Contract Detail

The smart contract detail panel contains a visualization of the smart contract's ABI (application binary interface) in formatted JSON. If the smart contract has references to multi-index tables, you also have the ability to view the raw data of any of the tables via a dropdown menu that appears directly below this panel on the left hand-side. If the smart contract has no such references, you will only see this panel. 

## Multi-Index Table Raw Data

This panel contains the raw data contained in a particular multi-index table of the currently searched smart contract. The data may either be very complex or very simple depending on the smart contract and the available data stored on the blockchain, so be careful if you open a smart contract with multi-index table containing a lot of data.

To obtain the data, first you would need to specify the multi-index table to show, which is the dropdown menu shown below the smart contract detail panel. Then, you need to specify the `scope` (scopes are currently used to logically separate tables in contracts that contain more than one table in a single multi-index) which by default copies the name of the smart contract. 

After specifying the scope, you can click "Get Data" to reveal the multi-index table raw data panel.
