# How to Develop

This application is bootstrapped with `create-react-app` version 2. Therefore, if you have used CRA in the past, contributing to the development of this tool would not be too difficult.

## Import by Absolute Path 

Adding `src` to `NODE_PATH` in the `.env` file would allow you to require/import by absolute path under the `./src` folder.

## CSS and Styling

This application makes use of Bootstrap by means of `reactstrap` to render Bootstrap components and to make use of various SASS modules from the Bootstrap SASS library. A reset stylesheet has already been included and can be viewed [here](src/app/reset.scss). 

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

A good starting point is viewing the [source for the Blocklist visualizer](src/pages/BlocklistPage/components/Blocklist).