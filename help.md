# EOSIO-Toppings

A monorepo with tools working on top of nodeos

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Make sure you have installed all of the following prerequisites on your development machine:
* Git - [Download & Install Git](https://git-scm.com/downloads). OSX and Linux machines typically have this already installed.
* Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager. If you encounter any problems, you can also use this [GitHub Gist](https://gist.github.com/isaacs/579814) to install Node.js.
* Yarn - [Download & Install Yarn](https://yarnpkg.com/lang/en/docs/install/)
* Docker - [Download & Install Docker](https://download.docker.com/)
* Typescript - [Download & Install typescript](https://www.typescriptlang.org/#download-links)

### Cloning The GitHub Repository
The recommended way to get MEAN.js is to use git to directly clone the MEAN.JS repository:

```bash
$ git clone https://github.com/EOSIO/eosio-toppings/ eosio-toppings
```

This will clone the latest version of the MEAN.JS repository to a **meanjs** folder.

### Downloading The Repository Zip File
Another way to use the eosio-toppings is to download a zip copy from the [master branch on GitHub](https://github.com/EOSIO/eosio-toppings/archive/master.zip). You can also do this using the `wget` command:

```bash
$ wget https://github.com/EOSIO/eosio-toppings/archive/master.zip -O eosio-toppings.zip; unzip eosio-toppings.zip; rm eosio-toppings.zip
```

### Installing
Once you've downloaded the eosio-toppings and installed all the prerequisites, you're just a few steps away from starting to run the eosio-toppings application.

The code comes pre-bundled with a package.json and yarn.lock files that contain the list of modules you need to start your application.

To install the dependencies, run this in the application folder from the command-line:
```sh
./first_time_setup.sh
```
This command does a few things:

1. Install all required dependencies
2. Build the docker images
3. Check and remove any existing docker with names `eosio-mongodb` and `eosio_gui_nodeos_container`
4. Start the dockers
5. Setup compiler api
6. Start the GUI

## Running Your Application

Run your application using this:

```bash
$ ./quick_start.sh
```

Your application should run on port 3000 with the *development* environment configuration, so in your browser just go to [http://localhost:3000](http://localhost:3000)

That's it! Your application should be running. To proceed with your development, check the other sections in this documentation.

## Project structure
```bash
eosio-toppings # project directory
├── LICENSE
├── README.md
├── apps # general scripts for blockchain
│   └── gui-nodeos
│       ├── README.md
│       ├── build_dockers.sh
│       ├── clear_all_blockchain_data.sh
│       ├── pause_blockchain.sh
│       ├── resume_blockchain.sh
│       └── start_blockchain.sh
├── first_time_setup.sh # first time setup script
├── help.md
├── lerna.json
├── package.json
├── packages # Each folder in packages reperesent a service runs on top of EOSIO blockchain or as a helper for other services in this same folde
│   ├── README.md
│   ├── api-eosio-compiler # Service to compile and deploy contract
│   │   ├── README.md
│   │   ├── compiler.log
│   │   ├── docker-eosio-cdt
│   │   │   ├── Dockerfile
│   │   │   ├── build_eosio_cdt_docker.sh
│   │   │   ├── contracts
│   │   │   │   └── hiworld.cpp
│   │   │   ├── error.txt
│   │   │   ├── remove_eosio_cdt_docker.sh
│   │   │   ├── scripts
│   │   │   │   └── compile_contract.sh
│   │   │   ├── setup_eosio_cdt_docker.sh
│   │   │   ├── start_eosio_cdt_docker.sh
│   │   │   ├── stderr.txt
│   │   │   └── stdout.txt
│   │   ├── helpers.js
│   │   ├── local-service.js
│   │   ├── package.json
│   │   └── service-logic.js
│   ├── api-mongodb-plugin # APIs to fetch details from MongoDB
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── api
│   │   │   │   ├── get_abi.ts
│   │   │   │   ├── get_account_details.ts
│   │   │   │   ├── get_action_details.ts
│   │   │   │   ├── get_actions.ts
│   │   │   │   ├── get_all_permissions.ts
│   │   │   │   ├── get_block_details.ts
│   │   │   │   ├── get_block_latest.ts
│   │   │   │   ├── get_blocks.ts
│   │   │   │   ├── get_transaction_details.ts
│   │   │   │   ├── get_transactions.ts
│   │   │   │   └── index.ts
│   │   │   ├── config
│   │   │   │   └── mongo.ts
│   │   │   ├── index.ts
│   │   │   ├── models
│   │   │   │   ├── account.ts
│   │   │   │   ├── account_details.ts
│   │   │   │   ├── actions.ts
│   │   │   │   ├── block.ts
│   │   │   │   ├── permissions.ts
│   │   │   │   ├── transaction_traces.ts
│   │   │   │   └── transactions.ts
│   │   │   └── run.ts
│   │   └── tsconfig.json
│   ├── api-rpc # APIs to fetch details from EOSIO blockchain
│   │   ├── README.md
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── api
│   │   │   │   ├── create_account.ts
│   │   │   │   ├── get_account_details.ts
│   │   │   │   ├── get_info.ts
│   │   │   │   ├── get_table_rows.ts
│   │   │   │   └── push_action.ts
│   │   │   └── index.ts
│   │   └── tsconfig.json
│   ├── *docker-eosio-nodeos # EOSIO docker
│   │   ├── Dockerfile
│   │   ├── README.md
│   │   ├── build_eosio_docker.sh 
│   │   ├── contracts # dummy contracts
│   │   │   ├── byeworld
│   │   │   │   ├── byeworld.abi
│   │   │   │   ├── byeworld.cpp
│   │   │   │   └── byeworld.wasm
│   │   │   ├── helloworld
│   │   │   │   └── helloworld.cpp
│   │   │   ├── hiworld
│   │   │   │   ├── hiworld.abi
│   │   │   │   ├── hiworld.cpp
│   │   │   │   └── hiworld.wasm
│   │   │   ├── tataworld
│   │   │   │   ├── tataworld.abi
│   │   │   │   ├── tataworld.cpp
│   │   │   │   └── tataworld.wasm
│   │   │   └── testnote
│   │   │       └── testnote.cpp
│   │   ├── remove_eosio_docker.sh # remove eosio docker and its content
│   │   ├── scripts # Scripts for docker containers
│   │   │   ├── accounts.json # list of sample account 
│   │   │   ├── continue_blockchain.sh # resume blockchain 
│   │   │   ├── create_accounts.sh # create dummy accounts 
│   │   │   ├── deploy_contract.sh # deploy contract
│   │   │   └── init_blockchain.sh # initialize blockchain 
│   │   └── start_eosio_docker.sh # start eosio docker
│   ├── *docker-mongodb # Mongodb Docker
│   │   ├── README.md
│   │   ├── remove_mongodb_docker.sh
│   │   └── start_mongodb_docker.sh
│   └── ui-gui-nodeos # GUI for EOSIO blockchain
│       ├── README.md
│       ├── config-overrides.js
│       ├── package.json
│       ├── public
│       │   ├── index.html
│       │   ├── manifest.json
│       │   └── vendor
│       │       └── favicons
│       │           ├── favicon-144x144.png
│       │           ├── favicon-16x16.png
│       │           ├── favicon-32x32.png
│       │           └── favicon.ico
│       ├── routers
│       │   └── mongodb.js
│       ├── serve.js
│       └── src
│           ├── app
│           │   ├── App.jsx
│           │   ├── App.scss
│           │   └── index.js
│           ├── components # common components used in GUI
│           │   ├── CodeViewer
│           │   │   ├── CodeViewer.jsx
│           │   │   ├── CodeViewer.scss
│           │   │   └── index.js
│           │   ├── DragDropCodeViewer
│           │   │   ├── DragDropCodeViewer.jsx
│           │   │   ├── DragDropCodeViewer.scss
│           │   │   └── index.js
│           │   ├── Footer
│           │   │   ├── Footer.jsx
│           │   │   ├── Footer.scss
│           │   │   └── index.js
│           │   ├── Header
│           │   │   ├── Header.jsx
│           │   │   ├── Header.scss
│           │   │   ├── components
│           │   │   │   └── ConnectionIndicator
│           │   │   │       ├── ConnectionIndicator.jsx
│           │   │   │       ├── ConnectionIndicatorReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── HelpFAB
│           │   │   ├── HelpFAB.jsx
│           │   │   ├── HelpFAB.scss
│           │   │   └── index.js
│           │   ├── LoadingSpinner
│           │   │   ├── LoadingSpinner.jsx
│           │   │   ├── LoadingSpinner.scss
│           │   │   └── index.js
│           │   └── index.js
│           ├── helpers
│           │   ├── params-to-query.js
│           │   ├── pathname-consumer.js
│           │   └── useForm.js
│           ├── hocs
│           │   ├── WillRoute.jsx
│           │   └── index.js
│           ├── index.js
│           ├── pages # Contains all the pages of GUI
│           │   ├── AccountdetailPage
│           │   │   ├── AccountdetailPage.jsx
│           │   │   ├── AccountdetailPageReducer.js
│           │   │   ├── components
│           │   │   │   └── AccountDetail
│           │   │   │       ├── Accountdetail.jsx
│           │   │   │       ├── AccountdetailReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── ActiondetailPage
│           │   │   ├── ActiondetailPage.jsx
│           │   │   ├── ActiondetailPageReducer.js
│           │   │   ├── components
│           │   │   │   ├── Actiondetail
│           │   │   │   │   ├── Actiondetail.jsx
│           │   │   │   │   └── index.js
│           │   │   │   └── Actionjson
│           │   │   │       ├── Actionjson.jsx
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── ActionlistPage
│           │   │   ├── ActionlistPage.jsx
│           │   │   ├── ActionlistPageReducer.js
│           │   │   ├── components
│           │   │   │   └── Actionlist
│           │   │   │       ├── Actionlist.jsx
│           │   │   │       ├── ActionlistReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── BlockdetailPage
│           │   │   ├── BlockdetailPage.jsx
│           │   │   ├── BlockdetailPageReducer.js
│           │   │   ├── components
│           │   │   │   └── Blockdetail
│           │   │   │       ├── Blockdetail.jsx
│           │   │   │       ├── BlockdetailReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── BlocklistPage
│           │   │   ├── BlocklistPage.jsx
│           │   │   ├── BlocklistPageReducer.js
│           │   │   ├── components
│           │   │   │   └── Blocklist
│           │   │   │       ├── Blocklist.jsx
│           │   │   │       ├── BlocklistReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── ContractdetailPage
│           │   │   ├── ContractdetailPage.jsx
│           │   │   ├── ContractdetailPageReducer.js
│           │   │   ├── components
│           │   │   │   ├── Contractdetail
│           │   │   │   │   ├── Contractdetail.jsx
│           │   │   │   │   ├── ContractdetailReducer.js
│           │   │   │   │   └── index.js
│           │   │   │   └── MultiIndex
│           │   │   │       ├── MultiIndex.jsx
│           │   │   │       ├── MultiIndexReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── DeploymentPage
│           │   │   ├── DeploymentPage.jsx
│           │   │   ├── DeploymentPageReducer.js
│           │   │   ├── components
│           │   │   │   └── InputInstructions
│           │   │   │       ├── InputInstructions.jsx
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── InfoPage
│           │   │   ├── InfoPage.jsx
│           │   │   ├── InfoPage.scss
│           │   │   ├── InfoPageReducer.js
│           │   │   ├── components
│           │   │   │   ├── BlockchainInfo
│           │   │   │   │   ├── BlockchainInfo.jsx
│           │   │   │   │   ├── BlockchainInfoReducer.js
│           │   │   │   │   └── index.js
│           │   │   │   ├── Headblock
│           │   │   │   │   ├── Headblock.jsx
│           │   │   │   │   └── index.js
│           │   │   │   ├── LastIrreversibleBlockInfo
│           │   │   │   │   ├── LastIrreversibleBlockInfo.jsx
│           │   │   │   │   └── index.js
│           │   │   │   └── Nodeswitch
│           │   │   │       ├── Nodeswitch.jsx
│           │   │   │       ├── NodeswitchValidatorEngine.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── PermissionPage
│           │   │   ├── PermissionPage.jsx
│           │   │   ├── PermissionPageReducer.js
│           │   │   ├── components
│           │   │   │   ├── CreateAccount
│           │   │   │   │   ├── CreateAccount.jsx
│           │   │   │   │   ├── CreateAccountReducer.js
│           │   │   │   │   ├── CreateAccountValidatorEngine
│           │   │   │   │   │   └── CreateAccountValidatorEngine.js
│           │   │   │   │   └── index.js
│           │   │   │   ├── ImportAccount
│           │   │   │   │   ├── ImportAccount.jsx
│           │   │   │   │   ├── ImportAccountValidatorEngine
│           │   │   │   │   │   └── ImportAccountValidatorEngine.js
│           │   │   │   │   └── index.js
│           │   │   │   └── Permissionlist
│           │   │   │       ├── Permissionlist.jsx
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   ├── PrivacyPolicyPage
│           │   │   ├── PrivacyPolicyPage.jsx
│           │   │   ├── PrivacyPolicyPage.scss
│           │   │   └── index.js
│           │   ├── PushactionPage
│           │   │   ├── PushactionPage.jsx
│           │   │   ├── PushactionPageReducer.js
│           │   │   └── index.js
│           │   ├── TermsOfUsePage
│           │   │   ├── TermsOfUsePage.jsx
│           │   │   ├── TermsOfUsePage.scss
│           │   │   └── index.js
│           │   ├── TestRPCPage
│           │   │   ├── TestRPCPage.jsx
│           │   │   ├── TestRPCPage.scss
│           │   │   └── index.js
│           │   ├── TransactiondetailPage
│           │   │   ├── TransactiondetailPage.jsx
│           │   │   ├── TransactiondetailPageReducer.js
│           │   │   ├── components
│           │   │   │   └── Transactiondetail
│           │   │   │       ├── Transactiondetail.jsx
│           │   │   │       ├── TransactiondetailReducer.js
│           │   │   │       └── index.js
│           │   │   └── index.js
│           │   └── TransactionlistPage
│           │       ├── TransactionlistPage.jsx
│           │       ├── TransactionlistPageReducer.js
│           │       ├── components
│           │       │   └── Transactionlist
│           │       │       ├── Transactionlist.jsx
│           │       │       ├── TransactionlistReducer.js
│           │       │       └── index.js
│           │       └── index.js
│           ├── reducers
│           │   ├── endpoint.js
│           │   ├── headblock.js
│           │   ├── index.js
│           │   ├── lastblockinfo.js
│           │   └── permission.js
│           ├── scss
│           │   ├── _body.scss
│           │   ├── _custom.scss
│           │   ├── _ie-fix.scss
│           │   ├── _mixins.scss
│           │   ├── _variables.scss
│           │   ├── style.scss
│           │   └── vendors
│           │       └── _variables.scss
│           ├── services
│           │   ├── api-mongodb.js
│           │   └── api-rpc.js
│           ├── setupProxy.js
│           ├── store
│           │   ├── index.js
│           │   └── redux-persist-config.js
│           ├── styled
│           │   └── SearchButton.js
│           └── templates
│               ├── StandardTemplate
│               │   ├── StandardTemplate.jsx
│               │   ├── StandardTemplate.scss
│               │   └── index.js
│               └── index.js
├── pause_dockers.sh # pause running dockers
├── quick_start.sh # start/resume dockers, services & gui
├── remove_dockers.sh # remove dockers and its contents
└── yarn.lock

* means the directory will be mounted to the docker container. Whenever the file changes on the local machine, it will be automatically reflected in the docker environment.
```

## License

[MIT](./LICENSE)

## Important

See LICENSE for copyright and license terms.  Block.one makes its contribution on a voluntary basis as a member of the EOSIO community and is not responsible for ensuring the overall performance of the software or any related applications.  We make no representation, warranty, guarantee or undertaking in respect of the software or any related documentation, whether expressed or implied, including but not limited to the warranties or merchantability, fitness for a particular purpose and noninfringement. In no event shall we be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or documentation or the use or other dealings in the software or documentation.  Any test results or performance figures are indicative and will not reflect performance under all conditions.  Any reference to any third party or third-party product, service or other resource is not an endorsement or recommendation by Block.one.  We are not responsible, and disclaim any and all responsibility and liability, for your use of or reliance on any of these resources. Third-party resources may be updated, changed or terminated at any time, so the information here may be out of date or inaccurate.
