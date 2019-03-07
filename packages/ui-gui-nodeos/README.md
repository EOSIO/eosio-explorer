# Introduction
The frontend part of an application of the GUI of Nodeos.

## Used by Applications
* GUI of Nodeos


# Development

## First time setup
Install dependencies
`yarn install`

## Start development
Start development
`yarn start`

## Different in development
In production, we use `serve.js` to serve both api calls and static `/build/` files.
In development, we use `src/setupProxy.js` to proxy API calls to a background serve.js process ( see `prestart` in `packages.json`)

# Build
Enter `yarn run build` to build a static production distribution.

# Serve
```
node serve.js
```

# App Structure

## create-react-app v2
Using create-react-app v2 as the basis for this web app.

## Reset css
This is always good add an reset stylesheet at the first place to syncing cross browsers css behaviour before starting any styling work.
Please refer to `/src/reset.scss`

## Bootstrap Css
We use package reactstrap ( compatible with Bootstrap v4.0.0 ) for rendering Bootstrap components and include the corresponding scss module from Bootstrap scss library.

We need to add variable `SASS_PATH=node_modules` in .env
Then you can import bootstrap css library from node_modules directly

## Custom Mixins and Variables

We need to update variable `SASS_PATH=node_modules:src/scss` in .env
Add mixins and variables into `/src/scss` with underscore prefixed to state it is a library css. Include the path in package.json build script.
Use the mixins by `@import "mixins"` and `@import "variables"`

# App structure

## Path
Add `NODE_PATH=src` into .env file. You could import ( require ) by absolute path under /src

## Pages, Template, Components
Seperate UI Components into three folders

### Pages
Mostly each URL on your website route to a page. Create a page component whenever you need a new URL to display new content.

### Templates
It is common to have same header and footer in different pages of you website. A template consist of a header and a footer wrapper the page content. The page component should always include ( by Containment ) a template

### Components
Common components that being used across the site. Header and Footer is put inside this folder. You may also put Buttons, Panes, Sections in this folder.

## Routing
We use react-router with react-router-dom to simulate broswer url and history behaviour.

## Creating new page
Create a new page component in pages folder, add a new `<Route>` and link to the new page component in `<Swtich>` Component. An example of creating a 404 page is along with the commit. Also you can do the redirect with `<Redirect>`.

## WillRoute Component
You may always want to do something just before routing to a new page. Like doing authen checking, scrolling to top, etc...
Do these in the `<WillRoute>` Component. And scroll to top example is committed along with this.

## Prerendering
`react-snap` crawls all route and prerending pages into .html files to have a fast first load for each page
