import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { connectRouter } from 'connected-react-router';

import { combinedEpic as permissionEpic, combinedReducer as permissionReducer } from './permission';
import { combinedEpic as endpointEpic, combinedReducer as endpointReducer } from './endpoint';
import { combinedEpic as headblockEpic, combinedReducer as headblockReducer} from './headblock';
import { combinedEpic as lastblockinfoEpic, combinedReducer as lastblockinfoReducer} from './lastblockinfo';
import { combinedEpic as connectionIndicatorEpic, combinedReducer as connectionIndicatorReducer} from 'components/Header/components/ConnectionIndicator/ConnectionIndicatorReducer';
import { combinedEpic as errorlogEpic, combinedReducer as errorlogReducer} from './errorlog';

import { combinedEpic as infoPageEpic, combinedReducer as infoPageReducer } from 'pages/InfoPage/InfoPageReducer';
import { combinedEpic as blocklistPageEpic, combinedReducer as blocklistPageReducer } from 'pages/BlocklistPage/BlocklistPageReducer';
import { combinedEpic as blockdetailPageEpic, combinedReducer as blockdetailPageReducer } from 'pages/BlockdetailPage/BlockdetailPageReducer';
import { combinedEpic as transactionlistPageEpic, combinedReducer as transactionlistPageReducer } from 'pages/TransactionlistPage/TransactionlistPageReducer';
import { combinedEpic as transactiondetailPageEpic, combinedReducer as transactiondetailPageReducer } from 'pages/TransactiondetailPage/TransactiondetailPageReducer';
import { combinedEpic as actionlistPageEpic, combinedReducer as actionlistPageReducer } from 'pages/ActionlistPage/ActionlistPageReducer';
import { combinedEpic as actiondetailPageEpic, combinedReducer as actiondetailPageReducer } from 'pages/ActiondetailPage/ActiondetailPageReducer';
import { combinedEpic as accountdetailPageEpic, combinedReducer as accountdetailPageReducer } from 'pages/AccountdetailPage/AccountdetailPageReducer';
import { combinedEpic as contractdetailPageEpic, combinedReducer as contractdetailPageReducer } from 'pages/ContractdetailPage/ContractdetailPageReducer';
import { combinedEpic as permissionPageEpic, combinedReducer as permissionPageReducer } from 'pages/PermissionPage/PermissionPageReducer';
import { combinedEpic as deploymentPageEpic, combinedReducer as deploymentPageReducer } from 'pages/DeploymentPage/DeploymentPageReducer';
import { combinedEpic as pushactionPageEpic, combinedReducer as pushactionPageReducer } from 'pages/PushactionPage/PushactionPageReducer';
import { combinedEpic as checkShipVersionEpic, combinedReducer as CheckShipVersionPageReducer } from 'pages/CheckShipVersionPage/CheckShipVersionPageReducer';


export const rootEpic = combineEpics(
  permissionEpic,
  endpointEpic,
  headblockEpic,
  lastblockinfoEpic,
  connectionIndicatorEpic,
  errorlogEpic,
  infoPageEpic,
  blocklistPageEpic,
  blockdetailPageEpic,
  transactionlistPageEpic,
  transactiondetailPageEpic,
  actionlistPageEpic,
  actiondetailPageEpic,
  accountdetailPageEpic,
  contractdetailPageEpic,
  permissionPageEpic,
  deploymentPageEpic,
  pushactionPageEpic,
  checkShipVersionEpic
);

export const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  permission: permissionReducer,
  endpoint: endpointReducer,
  headblock: headblockReducer,
  lastblockinfo: lastblockinfoReducer,
  connectionIndicator: connectionIndicatorReducer,
  errorlog: errorlogReducer,
  infoPage: infoPageReducer,
  blocklistPage: blocklistPageReducer,
  blockdetailPage: blockdetailPageReducer,
  transactionlistPage: transactionlistPageReducer,
  transactiondetailPage: transactiondetailPageReducer,
  actionlistPage: actionlistPageReducer,
  actiondetailPage: actiondetailPageReducer,
  accountdetailPage: accountdetailPageReducer,
  contractdetailPage: contractdetailPageReducer,
  permissionPage: permissionPageReducer,
  deploymentPage: deploymentPageReducer,
  pushactionPage: pushactionPageReducer,
  checkShipVersionPage: CheckShipVersionPageReducer
})
