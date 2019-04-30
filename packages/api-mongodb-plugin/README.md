# api-mongodb-plugin <img alt="NPM Version" src="https://img.shields.io/npm/v/EOSIO/api-mongodb-plugin.svg">
RESTful API service making use of the nodeos RPC API wrapper `eosjs` to obtain data from the blockchain that can not be fetched using `api-mongodb-plugin`.

## Manual Usage
Install TypeScript and `tsc` (TypeScript Compiler) globally with
```
yarn global add typescript
```

## Compile and Watch
Compile the source into `js` and watch for changes into `./dist` with the following command:
```
rm -rf dist && tsc -w
```

## Test Service
Do `node dist/run.js` in order to spin a node service that lets you directly call the API for testing