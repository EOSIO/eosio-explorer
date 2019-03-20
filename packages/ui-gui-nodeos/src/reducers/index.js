import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { connectRouter } from 'connected-react-router';

import { counterReducer } from './counter';

import { combinedEpic as infoPageEpic, combinedReducer as infoPageReducer } from 'pages/InfoPage/InfoPageReducer';
import { combinedEpic as blocklistPageEpic, combinedReducer as blocklistPageReducer } from 'pages/BlocklistPage/BlocklistPageReducer';
import { combinedEpic as blockdetailPageEpic, combinedReducer as blockdetailPageReducer } from 'pages/BlockdetailPage/BlockdetailPageReducer';
import { combinedEpic as transactionlistPageEpic, combinedReducer as transactionlistPageReducer } from 'pages/TransactionlistPage/TransactionlistPageReducer';
import { combinedEpic as transactiondetailPageEpic, combinedReducer as transactiondetailPageReducer } from 'pages/TransactiondetailPage/TransactiondetailPageReducer';
import { combinedEpic as actionlistPageEpic, combinedReducer as actionlistPageReducer } from 'pages/ActionlistPage/ActionlistPageReducer';
import { combinedEpic as actiondetailPageEpic, combinedReducer as actiondetailPageReducer } from 'pages/ActiondetailPage/ActiondetailPageReducer';


export const rootEpic = combineEpics(
  infoPageEpic,
  blocklistPageEpic,
  blockdetailPageEpic,
  transactionlistPageEpic,
  transactiondetailPageEpic,
  actionlistPageEpic,
  actiondetailPageEpic,
);

export const rootReducer = (history) => combineReducers({
  router: connectRouter(history),
  counter: counterReducer,
  infoPage: infoPageReducer,
  blocklistPage: blocklistPageReducer,
  blockdetailPage: blockdetailPageReducer,
  transactionlistPage: transactionlistPageReducer,
  transactiondetailPage: transactiondetailPageReducer,
  actionlistPage: actionlistPageReducer,
  actiondetailPage: actiondetailPageReducer,
})
