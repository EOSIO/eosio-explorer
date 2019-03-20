import './reset.scss';
import './site.scss';
import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';

import InfoPage from 'pages/InfoPage';
import BlocklistPage from 'pages/BlocklistPage';
import BlockdetailPage from 'pages/BlockdetailPage';
import TransactionlistPage from 'pages/TransactionlistPage';
import TransactiondetailPage from 'pages/TransactiondetailPage';
import PermissionsPage from 'pages/PermissionsPage';
import NotFoundPage from 'pages/NotFoundPage';
import PrivacyPolicyPage from 'pages/PrivacyPolicyPage';
import TermsOfUsePage from 'pages/TermsOfUsePage';

import { WillRoute } from 'hocs';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <WillRoute exact path="/" component={ InfoPage }/>
          <WillRoute exact path="/block-list" component={ BlocklistPage }/>
          <WillRoute exact path="/block/:id" component={ BlockdetailPage }/>
          <WillRoute exact path="/transaction-list" component={ TransactionlistPage }/>
          <WillRoute exact path="/transaction/:id" component={ TransactiondetailPage }/>
          <WillRoute exact path="/permissions" component={ PermissionsPage }/>
          <WillRoute exact path="/404" component={ NotFoundPage }/>
          <WillRoute exact path="/privacy" component={ PrivacyPolicyPage }/>
          <WillRoute exact path="/terms" component={ TermsOfUsePage }/>
          <Redirect to="/404"/>
        </Switch>
      </div>
    );
  }
}

export default App;
