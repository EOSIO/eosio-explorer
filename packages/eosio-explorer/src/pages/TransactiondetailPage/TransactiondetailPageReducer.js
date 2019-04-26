import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as transactiondetailEpic, combinedReducer as transactiondetailReducer } from './components/Transactiondetail/TransactiondetailReducer';

export const combinedEpic = combineEpics(
  transactiondetailEpic
);

export const combinedReducer = combineReducers({
  transactiondetail: transactiondetailReducer,
})
