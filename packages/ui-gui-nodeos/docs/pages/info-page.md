[Home](../packages/ui-gui-nodeos/docs) > Info Page

# Info Page

The info page contains high level information about the currently connected `nodeos` instance (blockchain) and continuously polls for the latest irreversible block and the head block. On this page, users can also choose to switch to a different node and MongoDB service in case they are developing in a team and would like to test using a single node. When you first open the application, the info page should be the first thing you see.

## Connections

The Connections panel will indicate to users the URL of the endpoints the user is currently connected to for both `nodeos` and MongoDB running services. The user can choose to change either of these by directly editing the fields, and then clicking the **Connect** button. A **Reset** button is available in cases when the user would like to revert to the default configured endpoints.

## Headblock Information

The Headblock Information panel will denote the current head block of the blockchain running at the connected instance. It will show the following fields to the user:
* Block number
* Block ID
* Timestamp of creation
* Block producer

## Last Irreversible Block Information

The Last Irreversible Block Information panel will denote the latest irreversible block in the blockchain. It will show the following fields to the user:
* Block number
* Block ID
* Timestamp of creation