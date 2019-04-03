# ui-gui-nodeos
The code for the full web application, built using React. 

## Quick Start
1. `yarn install` to install all the dependencies
2. `yarn start` to run in development mode

## Build and Serve
In production environment, `serve.js` is the file used to serve both API calls and the static files in the `build/...` files. During development, `src/setupProxy.js` is used to proxy the API calls to a background `serve.js` process. More details available in the [package.json](package.json), check `prestart`.

To build from source, run `yarn run build` to create a static distribution for a production environment. To serve, you can do `node serve.js` directly. 

## Development

### create-react-app v2
Using create-react-app v2 as the basis for this web app.

### Reset css
This is always good add an reset stylesheet at the first place to syncing cross browsers css behaviour before starting any styling work.
Please refer to `src/app/reset.scss`

### Bootstrap Css
We use package reactstrap ( compatible with Bootstrap v4.0.0 ) for rendering Bootstrap components and include the corresponding scss module from Bootstrap scss library.

We need to add variable `SASS_PATH=node_modules` in .env
Then you can import bootstrap css library from node_modules directly

### Custom Mixins and Variables

We need to update variable `SASS_PATH=node_modules:src/scss` in .env
Add mixins and variables into `src/scss` with underscore prefixed to state it is a library css. Include the path in package.json build script.
Use the mixins by `@import "mixins"` and `@import "variables"`

### Path
Add `NODE_PATH=src` into .env file. You could import ( require ) by absolute path under /src

### Pages, Template, Components
Seperate UI Components into three folders

### Pages
Mostly each URL on your website route to a page. Create a page component whenever you need a new URL to display new content.

### Templates
It is common to have same header and footer in different pages of you website. A template consist of a header and a footer wrapper the page content. The page component should always include ( by Containment ) a template

### Components
Common components that being used across the site. Header and Footer is put inside this folder. You may also put Buttons, Panes, Sections in this folder.

### Routing
We use react-router with react-router-dom to simulate broswer url and history behaviour.

### Creating new page
Create a new page component in pages folder, add a new `<Route>` and link to the new page component in `<Swtich>` Component. An example of creating a 404 page is along with the commit. Also you can do the redirect with `<Redirect>`.

### WillRoute Component
You may always want to do something just before routing to a new page. Like doing authen checking, scrolling to top, etc...
Do these in the `<WillRoute>` Component. And scroll to top example is committed along with this.

### Prerendering
`react-snap` crawls all route and prerending pages into .html files to have a fast first load for each page

### Create a component.
Since we are having complicated behaivours in the component like firing async calls, error handling, read from localstorage, etc. We are heavily using redux / RxJS / redux-observable to handle all the data part of a component. Step for create a working component from an existing one.

### Clone from Headblock component
A minimal working exmample could be found in `src/pages/InfoPage/Headblock`. It polls from mongodb every 500 ms and shows the result in the UI. It also included loading state and error handling.

Step:

1. Clone the whole `Headblock` folder to the place that you want a new component to work.
2. Rename the component files and corresponding place in the code
3. **Modify the action prefix following the folder hierarchy since action types must be unique in the whole app**
4. Include the exported combinedReducer and combinedEpic in parent reducer ( page level reducer or root reducer).

### Action
We will use the action creator to create a plain action object.
Try to add new action for new feature in a general way with not adding specific component name into variables.
It ensure certain level of the reusability by letting others to clone this component form your new one.

### Epic
We use Epic from redux-observable to hanlde all the data flow between action and UI / user interaction / local storage. It includes async calls / polling ( timed event ), cancelling a promise. **Remember, each Epic expect actions in and return actions out.**

Know more from here: https://redux-observable.js.org/docs/basics/Epics.html

After you handle the data flow in the Epics, exporting by compose a combinedEpic.

### Redux
We decompose each feature into a sinle reducer and compose those reduces into a single one before exporting the combinedReducer.

For example, the `Blocklist` component is cloned from `Headblock` component but more a filter feature more.

Make a new reducer only for the filter feature and compose it into the existing one.

### More sample component

You may try to clone below components as a minimal working sample component.

* `Blocklist` component is having an extra filter feature that demostrate how to add a feature within a component with new actions / reducer / epic
* `Blockdetail` component is retrieving url params ( get `id` from url `/block/:id` ) and passing it into api calls.
