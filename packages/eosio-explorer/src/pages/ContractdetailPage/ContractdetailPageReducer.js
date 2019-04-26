import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as contractdetailEpic, combinedReducer as contractdetailReducer } from './components/Contractdetail/ContractdetailReducer';
import { combinedEpic as multiIndexEpic, combinedReducer as multiIndexReducer } from './components/MultiIndex/MultiIndexReducer';

export const combinedEpic = combineEpics(
  contractdetailEpic,
  multiIndexEpic
);

export const combinedReducer = combineReducers({
  contractdetail: contractdetailReducer,
  multiIndex: multiIndexReducer
})
