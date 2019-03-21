import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as actiondetailEpic, combinedReducer as actiondetailReducer } from './components/Actiondetail/ActiondetailReducer';

export const combinedEpic = combineEpics(
  actiondetailEpic
);

export const combinedReducer = combineReducers({
  actiondetail: actiondetailReducer,
})
