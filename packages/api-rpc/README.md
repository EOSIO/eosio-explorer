# api-rpc
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