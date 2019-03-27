import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as actiondetailEpic, combinedReducer as actiondetailReducer } from './components/Actiondetail/ActiondetailReducer';
import { combinedEpic as actionjsonEpic, combinedReducer as actionjsonReducer } from './components/Actionjson/ActionjsonReducer';

export const combinedEpic = combineEpics(
  actiondetailEpic,
  actionjsonEpic
);

export const combinedReducer = combineReducers({
  actiondetail: actiondetailReducer,
  actionjson: actionjsonReducer
})
