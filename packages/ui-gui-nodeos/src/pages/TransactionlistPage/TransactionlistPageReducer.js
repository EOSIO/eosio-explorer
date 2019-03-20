import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as transactionlistEpic, combinedReducer as transactionlistReducer } from './components/Transactionlist/TransactionlistReducer';

export const combinedEpic = combineEpics(
  transactionlistEpic
);

export const combinedReducer = combineReducers({
  transactionlist: transactionlistReducer,
})
