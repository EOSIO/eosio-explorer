import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { withRouter } from "react-router";

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
import TestRPCPage from 'pages/TestRPCPage';

import { WillRoute } from 'hocs';
import { connectStart } from 'reducers/endpoint';
import { pollingStart as headblock_pollingStart} from 'reducers/headblock';
import { pollingStart as lastblockinfo_pollingStart } from 'reducers/lastblockinfo';

class App extends Component {

  componentDidMount(){
    setTimeout(()=>{Loadable.preloadAll()}, 1000);

    let { endpoint: {nodeos, mongodb} } = this.props;
    this.props.connectStart(nodeos, mongodb);
    this.props.headblock_pollingStart();
    this.props.lastblockinfo_pollingStart();
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
          <WillRoute exact path="/account/:id" component={ AccountdetailPage }/>
          <WillRoute exact path="/contract" component={ ContractdetailPage }/>
          <WillRoute exact path="/contract/:id" component={ ContractdetailPage }/>
          <WillRoute exact path="/permission" component={ PermissionPage }/>
          <WillRoute exact path="/deploy" component={ DeploymentPage }/>
          <WillRoute exact path="/push-action" component={ PushactionPage }/>
          <WillRoute exact path="/privacy-policy" component={ PrivacyPolicyPage }/>
          <WillRoute exact path="/terms-of-use" component={ TermsOfUsePage }/>
          <WillRoute exact path="/rpc" component={ TestRPCPage }/>

          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(
  ({ endpoint }) => ({
    endpoint
  }),
  {
    connectStart,
    headblock_pollingStart,
    lastblockinfo_pollingStart,
  }

)(App));
