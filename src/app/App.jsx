import './App.scss';

import React, { Component } from 'react';
import { Switch, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import { connect } from 'react-redux';
import { withRouter } from "react-router";
import TagManager from 'react-gtm-module';

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
import CheckShipVersionPage from 'pages/CheckShipVersionPage';
import NotFound404Page from 'pages/NotFound404Page';

import { WillRoute } from 'hocs';
import { connectStart } from 'reducers/endpoint';
import { pollingStart as headblock_pollingStart} from 'reducers/headblock';
import { pollingStart as lastblockinfo_pollingStart } from 'reducers/lastblockinfo';
import { fetchStart as blockchaininfo_fetchstart } from 'pages/InfoPage/components/BlockchainInfo/BlockchainInfoReducer';

const prodTagManagerArgs = {
  gtmId: process.env.REACT_APP_PROD_GTM_ID
}

const devTagManagerArgs = {
  gtmId: process.env.REACT_APP_DEV_GTM_ID
}

class App extends Component {
  componentWillMount() {
    if(process.env.NODE_ENV === "development" ) {
      TagManager.initialize(devTagManagerArgs);
    }
    else {
      TagManager.initialize(prodTagManagerArgs);
    }
  }

  componentDidMount(){
    setTimeout(()=>{Loadable.preloadAll()}, 1000);
    this.props.connectStart(window._env_.NODE_PATH);
    this.props.blockchaininfo_fetchstart();
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
          <WillRoute exact path="/action/:block_num/:id" component={ ActiondetailPage }/>
          <WillRoute exact path="/account" component={ AccountdetailPage }/>
          <WillRoute exact path="/account/:id" component={ AccountdetailPage }/>
          <WillRoute exact path="/contract" component={ ContractdetailPage }/>
          <WillRoute exact path="/contract/:id" component={ ContractdetailPage }/>
          <WillRoute exact path="/permission" component={ PermissionPage }/>
          <WillRoute exact path="/deploy" component={ DeploymentPage }/>
          <WillRoute exact path="/push-action" component={ PushactionPage }/>
          <WillRoute exact path="/check-ship" component={ CheckShipVersionPage }/>
          <WillRoute exact path="/page-not-found" component={ NotFound404Page }/>
          
          <Redirect to="/" />
        </Switch>
      </div>
    );
  }
}

export default withRouter(connect(
  ({ endpoint, router }) => ({
    endpoint, router
  }),
  {
    connectStart,
    blockchaininfo_fetchstart,
    headblock_pollingStart,
    lastblockinfo_pollingStart,
  }

)(App));
