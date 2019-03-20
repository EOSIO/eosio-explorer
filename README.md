# toppings
A monorepo with tools working on top of nodeos

# Development

## First time setup
Install all dependencies
```
yarn install
```

### Setup for docker image
cd into `packages/docker-eosio-nodeos`
```
./first_time_setup.sh
```

## Development
Make sure you have `docker` installed and assigned 8Gb Ram for it.

Make 2 terminals.

First terminal, start dockers for mongodb/nodeos.
```
yarn start-dockers
```

Second terminal, start dockers for gui ( create-react-app ) and the api service.
```
yarn start-gui
```

Start development on browser at http://localhost:3000


## Add a dependency in a package
Using `yarn add` won't update the dependencies in each packages.json for each package.

Instead, we should use below command to add a dependency in a package.

For example, adding `express` in `packages/ui-gui-nodeos`
```
yarn workspace @eos-toppings/ui-gui-nodeos add express
```
