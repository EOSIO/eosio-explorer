import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as blockdetailEpic, combinedReducer as blockdetailReducer } from './components/Blockdetail/BlockdetailReducer';

export const combinedEpic = combineEpics(
  blockdetailEpic
);

export const combinedReducer = combineReducers({
  blockdetail: blockdetailReducer,
})
