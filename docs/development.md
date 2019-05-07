# Start Development

If you want to develop on this application ( etc. adding a new feature, bug fixing... ), please follow these steps to setup your local development environment.

Make sure `node.js`, `yarn`, `docker` are installed properly and we assume you are using macOS Mojave or higher to do the development.

## Steps

### eosio-toppings

`eosio-toppings` is a monorepo with all the dependecies required for this app, you may need to make changes also in these dependecies while your development.

1. git clone https://github.com/EOSIO/eosio-toppings
2. cd into `eosio-toppings` ( eosio-toppings repository project root)
3. cd into each of the below packages folder and run `yarn link` in each folder. A "success Registered" message should be shown each time you do `yarn link`
    - packages/api-eosio-compiler
    - packages/api-mongodb-plugin
    - packages/api-rpc
    - packages/docker-eosio-nodeos
    - packages/docker-mongodb

### eosio-explorer

1. git clone https://github.com/EOSIO/eosio-explorer
2. cd into `eosio-explorer` ( eosio-explorer repository project root)
3. Make symlinks to above local `eosio-toppings` dependecies. Run below commands. "success Using linked package" messages should be shown.
    - `yarn link @eosio-toppings/api-eosio-compiler`
    - `yarn link @eosio-toppings/api-mongodb-plugin`
    - `yarn link @eosio-toppings/api-rpc`
    - `yarn link @eosio-toppings/docker-e osio-nodeos`
    - `yarn link @eosio-toppings/docker-mongodb`
4. Run`yarn install`
5. Run `yarn eosio-explorer init` to initialize and start the app.
6. Stop the app by `Ctrl + C`. Run `yarn eosio-explorer start -dev` to start the app in development mode.

The setup development environment is finished. You can now start modifying the sources code in both repositories for the development at your local.


# Topics

## UI - create-react-app

This application is bootstrapped with `create-react-app` version 2. Therefore, if you have used CRA in the past, contributing to the development of this tool would not be too difficult.

## Import by Absolute Path

Adding `src` to `NODE_PATH` in the `.env` file would allow you to require/import by absolute path under the `./src` folder.

## CSS and Styling

This application makes use of Bootstrap by means of `reactstrap` to render Bootstrap components and to make use of various SASS modules from the Bootstrap SASS library. A reset stylesheet has already been included and can be viewed [here](../src/app/reset.scss).

### Custom Mixins and Variables

To allow custom mixins and variables, please ensure that `SASS_PATH` environment variable contains `src/scss`. If you wish to import Bootstrap's CSS library also, you will need to add `node_modules` to the environment variable also. It should look like this:
```
SASS_PATH=node_modules:src/scss
```
Then, you can add mixins and variables into the `src/scss` folder according to typical conventions, for example prefixing files with `_` (underscore) to indicate it is a library CSS. Include the path in the `package.json` build script.

## Extending Source

The source, at its core, is composed of three things:

1. Pages - What the user sees when they navigate to a particular URL. A page should be created when you wish to display something at a new URL / route.
2. Components - The building blocks of the page and the template. Individual parts that will be used throughout the site should be placed here/
3. Templates - A wrapper by which common components are shown in a particular layout which is used frequently. For example, it is common to have the same header and footer in different pages of the website. The page component should almost always be inside a template component.

Prerendering is done using `react-snap` by crawling all routes and prerendering the pages into `.html` files.

### Routing

To simulate browser URL behavior and the History API, the application makes use of `react-router` in tandem with `react-router-dom`. In order to include the route for new pages, you will need to add a new `<Route>` component which links to the new page inside the `<Switch>` component. Redirects can be done using `<Redirect>`.

If you want to add some extra behavior before switching to a new page with the router, you can use `<WillRoute>` to do so.

### Component Creation

The complex nature of the tool means that the implementation of certain behaviors may also be quite complex. To tackle the requirements of the tool, data flow is managed with a combination of Redux, RxJS and `redux-observable`. Looking at an existing component is the best way to learn how to work with these things.

A good starting point is viewing the [source for the Blocklist visualizer](../src/pages/BlocklistPage/components/Blocklist).
