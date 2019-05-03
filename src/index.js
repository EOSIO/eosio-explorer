import React from 'react';
import { hydrate, render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react'

import store, { history, persistor } from 'store';
import App from 'app';

const currentLastTimestamp = process.env.REACT_APP_LAST_INIT_TIMESTAMP;

// If currentLastTimestamp is not defined, current application run must not start from a init script.
// Hence, ignore below steps for not clearing persisted store and not setting local storage variable.
if ( currentLastTimestamp ){

  const storedLastTimestamp = localStorage.getItem('lastTimestamp');

  // If the current last timestamp from process.env does not match the stored one, it means user has run init
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
