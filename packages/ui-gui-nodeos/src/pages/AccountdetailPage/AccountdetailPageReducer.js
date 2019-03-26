import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as accountdetailEpic, combinedReducer as accountdetailReducer } from './components/AccountDetail/AccountdetailReducer';

export const combinedEpic = combineEpics(
  accountdetailEpic
);

export const combinedReducer = combineReducers({
  accountdetail: accountdetailReducer
})
