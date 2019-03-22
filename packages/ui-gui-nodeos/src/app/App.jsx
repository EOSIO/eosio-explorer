import './reset.scss';
import './site.scss';
import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';

import InfoPage from 'pages/InfoPage';
import BlocklistPage from 'pages/BlocklistPage';
import BlockdetailPage from 'pages/BlockdetailPage';
import TransactionlistPage from 'pages/TransactionlistPage';
import TransactiondetailPage from 'pages/TransactiondetailPage';
import ActionlistPage from 'pages/ActionlistPage';
import ActiondetailPage from 'pages/ActiondetailPage';
import AccountdetailPage from 'pages/AccountdetailPage';
import ContractdetailPage from 'pages/ContractdetailPage';
import PermissionPage from 'pages/PermissionPage';
import DeploymentPage from 'pages/DeploymentPage';
import PushactionPage from 'pages/PushactionPage';
import PrivacyPolicyPage from 'pages/PrivacyPolicyPage';
import TermsOfUsePage from 'pages/TermsOfUsePage';

import { WillRoute } from 'hocs';

class App extends Component {

  componentDidMount(){
    setTimeout(()=>{Loadable.preloadAll()}, 1000);
  }

  render() {
    return (
      <div className="App">
        <Switch>
          <WillRoute exact path="/" component={ InfoPage }/>
          <WillRoute exact path="/block-list" component={ BlocklistPage }/>
          <WillRoute exact path="/block/:id" component={ BlockdetailPage }/>
          <WillRoute exact path="/transaction-list" component={ TransactionlistPage }/>
          <WillRoute exact path="/transaction/:id" component={ TransactiondetailPage }/>
          <WillRoute exact path="/action-list" component={ ActionlistPage }/>
          <WillRoute exact path="/action/:id" component={ ActiondetailPage }/>
          <WillRoute exact path="/account" component={ AccountdetailPage }/>
          <WillRoute exact path="/contract" component={ ContractdetailPage }/>
          <WillRoute exact path="/permission" component={ PermissionPage }/>
          <WillRoute exact path="/deploy" component={ DeploymentPage }/>
          <WillRoute exact path="/push-action" component={ PushactionPage }/>
          <WillRoute exact path="/privacy" component={ PrivacyPolicyPage }/>
          <WillRoute exact path="/terms" component={ TermsOfUsePage }/>
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default App;
