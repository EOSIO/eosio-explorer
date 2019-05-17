[Home](..) > Info Page

# Info Page

The info page contains high level information about the currently connected `nodeos` instance (blockchain) and continuously polls for the latest irreversible block and the head block. On this page, users can also choose to switch to a different node and MongoDB service in case they are developing in a team and would like to test using a single node. When you first open the application with `yarn eosio-explorer start`, `yarn eosio-explorer init` or the standard `yarn start` after building, you will see a welcome message appear over the info page. It will provide you a brief explanation of what this tool is and what you can do with it. You can opt never to show this message again or simply click the "OK" button, which will only hide this message for your current development session.

## Connections

The connections panel will indicate to users the URL of the endpoints the user is currently connected to for both `nodeos` and MongoDB running services. The user can choose to change either of these by directly editing the fields, and then clicking the **Connect** button. A **Reset** button is available in cases when the user would like to revert to the default configured endpoints. 

### Changing the Connection

In order to change the connection to either the `nodeos` instance or the MongoDB service, you can edit the input fields in the Connections panel:

* Connected Nodeos - Shows you the current URL for the `nodeos` instance you are connected to. It is `http://localhost:8888` by default.
* Connected MongoDB - Shows you the current URL for the MongoDB service and database you are connected to. It is written similarly to a MongoDB connection string (`mongodb://<host>:<port>/<database>`). By default, it is `mongodb://localhost:27788/eosio_nodeos_mongodb_plugin`.

The **Connect** button will be enabled once these values have been changed. Reverting back to the original value will disable it once more. Clicking on it will connect you to the new endpoints you have input. You may refer to the indicators in the header to determine your current connection status (a green dot means you are connected while a red dot means connection failure or disconnection) to the endpoints.

### Things to Note

As a developer, you should be aware of the following things:

1. **The connected `nodeos` and MongoDB instances should match with each other**. If they do not match, you will encounter account-related issues and certain pages will not behave as expected.
2. A confirmation message will appear when you either attempt to connect to a new `nodeos` instance or attempt to reset your connection. This is because **all your currently stored private keys will be lost** upon changing connections. 

Two major caveats:

1. If you are in a network with other users or wish to develop by connecting to a `nodeos` instance hosted on something like AWS, **you should kindly start your tool locally and connect to the instance using this Connections panel**. Connecting to the IP directly without starting your tool locally would not allow you to deploy contracts as all smart contract compilation is done locally (note: deployment to a remote node is still possible in this situation after compilation). 
2. Using the same tool to connect to multiple `nodeos` instances simultaneously is **currently unsupported**, whether through multiple tabs or through multiple browsers.

## Blockchain Information

The blockchain information panel will simply display the key information of the running `nodeos` instance the user is connected to. It will show the following fields to the user:
* Server version
* Server version string
* Chain ID

## Headblock Information

The headblock information panel will denote the current head block of the blockchain running at the connected instance. It will show the following fields to the user:
* Block number
* Block ID
* Timestamp of creation
* Block producer

## Last Irreversible Block Information

The last irreversible block information panel will denote the latest irreversible block in the blockchain. It will show the following fields to the user:
* Block number
* Block ID
