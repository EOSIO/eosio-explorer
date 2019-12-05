[Home](..) > Info Page

# Info Page

The info page contains high level information about the currently connected `nodeos` instance (blockchain) and continuously polls for the latest irreversible block and the head block.  When you first open the application with `yarn eosio-explorer start`, `yarn eosio-explorer init` or the standard `yarn start` after building, you will see a welcome message appear over the info page. It will provide you a brief explanation of what this tool is and what you can do with it. You can opt never to show this message again or simply click the "OK" button, which will only hide this message for your current development session.

## Connections

The connections panel will indicate to users the URL of the endpoints the user is currently connected to for `nodeos`. 

Two major caveats:

1. If you are in a network with other users or wish to develop by connecting to a `nodeos` instance hosted on something like AWS, **you should kindly start your tool locally by providing the instance RPC endpoint using `init` command**. Connecting to the IP directly without starting your tool locally would not allow you to deploy contracts as all smart contract compilation is done locally (note: deployment to a remote node is still possible in this situation after compilation). 
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

## Connection indicator 

There are 2 connection indicators, the first represents the connection status between the tool and `nodeos` instance, the second represents the connection status between tool and PostgresDB.
