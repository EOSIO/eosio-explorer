# Introduction
RESTful api for retrieving data from mongodb ( which its data come from mongodb plugin of a nodeos).

## Depended by Packages
* ui-gui-nodeos

## Used by Applications
* GUI of Nodeos

# Development

## First time setup
Install typescript and tsc globally
```
yarn global add typescript
```

## Watch and Compile
Watch and compile ts to js into `/dist`
```
rm -rf dist && tsc -w
```

## Test to run
Call the APIs
```
node dist/run.js
```
