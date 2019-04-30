# eosio-explorer <img alt="NPM Version" src="https://img.shields.io/npm/v/eosio-explorer.svg">
The code for the full web application, built using React.

## Quick Start
1. `yarn install` to install all the dependencies
2. `yarn start` to run in development mode

## Build and Serve
In production environment, `serve.js` is the file used to serve both API calls and the static files in the `build/...` files. During development, `src/setupProxy.js` is used to proxy the API calls to a background `serve.js` process. More details available in the [package.json](package.json), check `prestart`.

To build from source, run `yarn run build` to create a static distribution for a production environment. To serve, you can do `node serve.js` directly.

## Documentation

* [Main Documentation](./docs)
* [Development](./docs/development.md)
