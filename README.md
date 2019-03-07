# toppings
A monorepo with tools working on top of nodeos

# Development

## First time setup
Install all dependencies
```
yarn install
```

## Add a dependency in a package
Using `yarn add` won't update the dependencies in each packages.json for each package.

Instead, we should use below command to add a dependency in a package.

For example, adding `express` in `packages/ui-gui-nodeos`
```
yarn workspace @eos-toppings/ui-gui-nodeos add express
```
