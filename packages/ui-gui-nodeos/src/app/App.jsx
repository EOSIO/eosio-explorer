import './reset.scss';
import './site.scss';
import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import InfoPage from 'pages/InfoPage';
import BlocklistPage from 'pages/BlocklistPage';
import PermissionsPage from 'pages/PermissionsPage';
import NotFoundPage from 'pages/NotFoundPage';
import { WillRoute } from 'hocs';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <WillRoute exact path="/" component={ InfoPage }/>
          <WillRoute exact path="/block-list" component={ BlocklistPage }/>
          <WillRoute exact path="/permissions" component={ PermissionsPage }/>
          <WillRoute exact path="/404" component={ NotFoundPage }/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    );
  }
}

export default App;
