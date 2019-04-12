[Home](..) > Info Page

# Info Page

The info page contains high level information about the currently connected `nodeos` instance (blockchain) and continuously polls for the latest irreversible block and the head block. On this page, users can also choose to switch to a different node and MongoDB service in case they are developing in a team and would like to test using a single node. When you first open the application, the info page should be the first thing you see.

## Connections

The connections panel will indicate to users the URL of the endpoints the user is currently connected to for both `nodeos` and MongoDB running services. The user can choose to change either of these by directly editing the fields, and then clicking the **Connect** button. A **Reset** button is available in cases when the user would like to revert to the default configured endpoints.

### Changing the Connection

In order to change the connection to either the `nodeos` instance or the MongoDB service, you can edit the input fields in the Connections panel:

* Connected Nodeos - Shows you the current URL for the `nodeos` instance you are connected to. It is `http://localhost:8888` by default.
* Connected MongoDB - Shows you the current URL for the MongoDB service and database you are connected to. It is written similarly to a MongoDB connection string (`mongodb://<host>:<port>/<database>`). By default, it is `mongodb://localhost:27017/mongopluginmainnet`.

The **Connect** button will be enabled once these values have been changed. Reverting back to the original value will disable it once more. Clicking on it will connect you to the new endpoints you have input. You may refer to the indicators in the header to determine your current connection status (a green dot means you are connected while a red dot means connection failure or disconnection) to the endpoints.

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
