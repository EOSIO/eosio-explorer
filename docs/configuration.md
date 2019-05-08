[Home](README.md) > Configuration

# Configuration of the Application

This section details information regarding the configuration of the application. 

There are several places where you can view and/or modify configuration based on your needs:

* [.env](../.env)
* [init_config.file](../init_config.file)
* [config.file](../config.file)

## :warning: Default Ports

Out of the box, this tool requires several ports to be opened and available for use:

* `3000` [ UI - Web Application in Development Mode (used for development) ]
* `5111` [ UI - Web Application in Standard Mode ]
* `8081` [ EOSIO Compiler/Deployment Local Service (Node.JS) ]
* `8888` [ `nodeos` RPC API Service ] 
* `9876` [ `nodeos` Net Plugin Service ] 
* `27788` [ MongoDB API Service ]

Currently, the ports for the `nodeos` RPC API and Net Plugin services **cannot** be modified.

## Modifying Configuration when running `init`

When you invoke the `init` command, it will take the values of the keys in the `init_config.file` file.

You can change the ports of the following things in this file:

* Port taken by the EOSIO Compiler/Deployment Local Service with `LOCAL_SERVICE_PORT` key
* Port taken by the web application in development mode with `APP_DEV_PORT` key
* Port taken by the web application in standard mode web with `APP_SERVE_PORT` key

The other keys in this file relate to the Docker services found in the [eosio-toppings](https://github.com/EOSIO/eosio-toppings) monorepo. Try **not** to modify these values **unless you know what you are doing**!

## Modifying Configuration when running `start`

When you invoke the `start` command, it will take the values of the keys in the `config.file` file. Alternatively, if you wish to override the values in those keys without actually changing the `config.file` file, you can create a `config.file.local` file which will take **priority** over `config.file`.

You can change the ports of the following things in this file:

* Port taken by the web application in development mode with `APP_DEV_PORT` key
* Port taken by the web application in standard mode with `APP_SERVE_PORT` key

The other keys in this file relate to the Docker services found in the [eosio-toppings](https://github.com/EOSIO/eosio-toppings) monorepo. Try **not** to modify these values **unless you know what you are doing**!

## Modifying Environment Variables

Sometimes, it is necessary to modify the environment variables used by the main web application. This may be for a multitude of reasons but the safest environment variables to change are:

* `REACT_APP_MONGODB_PORT` - The port of the MongoDB endpoint the web app will connect to on start-up. Defaults to `27788`.
* `REACT_APP_MONGODB_DB_NAME` - The name of the MongoDB database the web app should get data from after connecting to the MongoDB database. Defaults to `eosio_nodeos_mongodb_plugin`. 
* `REACT_APP_LOCAL_SERVICE_PORT` - The port of the EOSIO Compiler/Deployment Local Service. It should be the same as `LOCAL_SERVICE_PORT` inside `init_config.file`. 
* `REACT_APP_APP_SERVE_PORT` - The port of the web application in standard mode. Should match `APP_SERVE_PORT` in the other config files.

Try not to change the following environment variables:

* `REACT_APP_GTM_ID` - Used for analytics.
* `GENERATE_SOURCEMAP` - Used for page building.

:no_good: Under no circumstances should you change the following variables :no_good:

* `NODE_PATH`
* `SASS_PATH`

They are critical for the web application to run.
