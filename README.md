<h1 align="center">EOSIO Explorer</h1>
<p align="center">
  A full web application to communicate with EOSIO blockchain in a local development environment built using React.
</p>

<p align="center">
  <img alt="EOSIO Labs badge" src="https://img.shields.io/badge/EOSIO-Labs-5cb3ff.svg">
  <img alt="NPM Version" src="https://img.shields.io/npm/v/eosio-explorer.svg">
</p>

## Table of Contents

* [Overview](#overview)
   * [Features](#features)
   * [Platform Support](#platform-support)
   * [Required Tools](#required-tools)
* [Installation](#installation)
   * [For Users](#for-users)
   * [For Contributors](#for-contributors)
   * [OS Platform Specific](#os-platform-specific)
* [Usage](#usage)
* [Links to Documentation](#links-to-documentation)
* [Contributing](#contributing)
* [License](#license)
* [Important](#important)

## Overview

The EOSIO Explorer is a full web application that allows developers to bootstrap their smart contract development by providing them the ability to communicate with the EOSIO blockchain in a local development environment. The goal of this application is to provide app developers for the EOSIO blockchain (consisting of smart contract developers and front-end developers) a quick and easy way to create the local development environment required to make and test such applications on the EOSIO blockchain. 

The application provides developers the ability to review changes and updates that occur within the blockchain based on their own work, and has the capacity to allow teams of developers to work on the same instance of the blockchain. This is to add an extra layer of ease for application development especially as a way to allow both smart contract developers and front-end developers to work together more closely. For example, front-end developers can test by connecting their applications to the blockchain instantiated by this tool, and perform tests which smart contract developers can review instantly on the tool to determine if behavior is expected or not. 

The goal of this application is to enhance the user experience when developing EOSIO-based blockchain applications while at the same time lowering the barrier to entry for newcomers to EOSIO-based blockchain development.

### About EOSIO Labs

EOSIO Labs repositories are experimental.  Developers in the community are encouraged to use EOSIO Labs repositories as the basis for code and concepts to incorporate into their applications. Community members are also welcome to contribute and further develop these repositories. Since these repositories are not supported by Block.one, we may not provide responses to issue reports, pull requests, updates to functionality, or other requests from the community, and we encourage the community to take responsibility for these.

### :warning: Disclaimer :warning:

The EOSIO Explorer is designed specifically to be a tool for local development. Therefore, numerous things must be kept in mind:

1. **Wallet keys used for this tool may be compromised** if your machine is not properly secure.
2. **The tool is not compatible with the EOSIO Mainnet**
3. Tools that do not match the versions listed in [required tools](#required-tools) or OSes not listed in the [platform support list](#platform-support) may cause issues

### Features

1. :zap: Smart contract deployment to a connected EOSIO Blockchain
2. :key: Ability to create accounts with `active` and `owner` permissions on a locally created EOSIO Blockchain (:closed_lock_with_key: Private keys stored locally)
3. :octocat: Ability to push actions from a deployed smart contract to a connected EOSIO Blockchain
4. :telescope: Automatically updating lists for blocks produced, transactions performed, actions pushed, etc.
5. :sunglasses: Search for and review accounts and deployed smart contracts on the connected EOSIO Blockchain
6. :electric_plug: Simple way to connect to a different `nodeos` instance after opening the tool

### Platform Support

* Amazon Linux 2
* CentOS 7
* Ubuntu 16.04
* Ubuntu 18.04
* MacOS 10.14 (Mojave) 

### Required Tools

* [Yarn](https://yarnpkg.com/lang/en/) with support at `^1.15.2` (latest stable)
* [Docker](https://www.docker.com/) with support at Docker Engine `18.09.2` (latest stable)
* [Node.JS](https://nodejs.org/en/) with support at `^10.15.3` LTS (latest stable)

## Installation

### For Users

```bash
yarn global add eosio-explorer
```

This will create a globally installed instance of the tool which you can run anywhere.

If you wish to install the tool without `global`, then you can do the following instead:

```bash
git clone https://github.com/EOSIO/eosio-explorer.git
yarn install
```

### For Contributors

See: [Development](./docs/development.md)

### OS Platform Specific 

#### Ubuntu 18.04 / Ubuntu 16.04

If you want to start the tool with the bundled UI, you will need to make sure your machine or server can open headless Chrome in a sandbox. 

#### Amazon Linux 2 (AMI)

Out of the box, Amazon Linux will use an outdated version of Docker which this application currently does not support.

In order to install the tool properly, you will need to manually install the latest stable version of Docker using binaries.

Finally, this requires the instance to be able to run or open headless Chrome in a sandbox.

#### CentOS 7

The tool requires starting a sandbox for headless Chrome, which can get complicated when attempting to run the tool on a variety of instances that don't specifically open a browser.

In CentOS specifically, `SELinux` impedes this process ([original issue](https://github.com/GoogleChrome/puppeteer/issues/2857#issuecomment-446983425)).

You will need to create an exception within SELinux. Setting the following boolean will fix this particular issue:
```bash
setsebool -P unconfined_chrome_sandbox_transition 0
```

Alternatively, though not necessarily recommended, you can disable `SELinux` entirely. 

## Usage

After installation of the application, depending on how you have installed the tool, can be run in different ways.

```bash
Installed with global:                eosio-explorer <command>
Installed via cloning the repository: yarn eosio-explorer <command>

Run the tool with the specified command

Commands:
  init              Initialize the tool by installing all dependencies, setting up 
                    all Docker containers, etc.
                    Available flags:
                    -dev / --develop - Starts the tool in development mode
                    -s / --sample-data - Starts the tool with pre-existing sample accounts 
                                         and smart contracts
  start             Start the tool, assumes the dependencies and Docker images are already prepared
                    Available flags:
                    -dev / --develop - Starts the tool in development mode
                    -d / --delete - Removes existing Docker containers
                    --init - Builds a production-ready version of the web tool, 
                             and opens the tool with cleared local storage
                    -s / --sample-data - Starts the tool with pre-existing 
                                         sample accounts and smart contracts
  start_gui         Starts the web tool locally without touching the nodeos and MongoDB containers.
                    Available flags:
                    -dev / --develop - Starts the tool in development mode
                    --clear-browser-storage - Clears the local storage
  pause_dockers     Pause any currently running Docker containers
  remove_dockers    Remove any currently present Docker containers
```

## Links to Documentation

* [Main Documentation](./docs)
* [Development](./docs/development.md)

## Contributing

Interested in contributing? That's awesome! Please view the following links for more information on contributing to the project.

[Contribution Guidelines](./CONTRIBUTING.md)

[Code of Conduct](./CONTRIBUTING.md#conduct)

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.

Wallets and related components are complex software that require the highest levels of security.  If incorrectly built or used, they may compromise users’ private keys and digital assets. Wallet applications and related components should undergo thorough security evaluations before being used.  Only experienced developers should work with this software.
