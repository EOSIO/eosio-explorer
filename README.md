# EOSIO Toppings

This is a monorepo composed of the various packages which work together to create a web-based development tool to help users create applications on the EOSIO blockchain. Users will be able to perform various actions related to smart contract and application development using this tool. 

## Package Index

* [Nodeos GUI Web UI](./packages/ui-gui-nodeos): React-based Web Application making use of all the services in this repo
* API Services:
    * [EOSIO Compiler / Deployment Service](./packages/api-eosio-compiler): Node.JS/Express API server for compiling and deploying smart contracts to a `nodeos` instance. Spins up a Docker container under the hood for contract compilation.
    * [MongoDB Plugin API](./packages/api-mongodb-plugin): TypeScript API service for interacting with the blockchain MongoDB (`nodeos` run with the MongoDB plugin)
    * [RPC API](./packages/api-rpc): TypeScript API service wrapper around the EOSIO RPC API
* Docker-based Services:
    * [EOSIO nodeos Docker Container](./packages/docker-eosio-nodeos): Dockerfile and build scripts for the Docker container running a local `nodeos` instance
    * [MongoDB Docker Container](./packages/docker-mongodb): Dockerfile and build scripts for the Docker container running a local MongoDB service

## Directory Layout

At present there are two main directories:

* **apps** - Utilities that may be useful for developers outside of the main functions and services
* **packages** - Contains the main services that comprise this monorepo

## Getting Started

A more detailed explanation on how to get started with the EOSIO Toppings tool can be found in the [help document](help.md).

To get quickly set up and running with this tool, please perform the following steps:
1. Directly clone this monorepo (using `git clone`)
2. Navigate to the root level of the cloned repository and run `./first_time_setup.sh` to install and build all the necessary dependencies
3. Run `./quick_start.sh`, which will automatically start the tool in your browser at `http://localhost:3000` after creating the necessary containers and services

### Caveats (ports)

By default, the following ports need to be opened:

* `3000` (main tool in server mode)
* `5000` (main tool in production mode)
* `8081` (EOSIO compiler/deployment service)

However, you are free to change these at your leisure.

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.
