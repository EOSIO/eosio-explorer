import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react'
import Cookies from 'js-cookie';

import store, { history, persistor } from 'store';
import App from 'app';

// Set the current timestamp from cookie -> process.env -> default empty
const currentLastTimestamp = Cookies.get('lastTimestamp') || process.env.REACT_APP_LAST_INIT_TIMESTAMP || "";

// If currentLastTimestamp is empty, current application run does not need to clear local storage.
// Hence, ignore below steps for not clearing persisted store and not setting local storage variable.
if ( currentLastTimestamp ){

  const storedLastTimestamp = localStorage.getItem('lastTimestamp');

  // If the current last timestamp from cookies / process.env does not match the stored one, it means user has run init or has built the app again
  // Hence, clear the whole persisted store.
  if ( currentLastTimestamp !== storedLastTimestamp ){
    persistor.purge();
  }

  localStorage.setItem('lastTimestamp', currentLastTimestamp);

}

const AppBundle = (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <>
          <App/>
          <div id="modal"></div>
        </>
      </ConnectedRouter>
    </PersistGate>
  </Provider>
);

const rootElement = document.getElementById("root");
if (rootElement.hasChildNodes()) {
  hydrate(AppBundle, rootElement);
} else {
  render(AppBundle, rootElement);
}
