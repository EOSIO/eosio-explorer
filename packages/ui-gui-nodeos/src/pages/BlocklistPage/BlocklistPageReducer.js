import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as blocklistEpic, combinedReducer as blocklistReducer } from './components/Blocklist/BlocklistReducer';

export const combinedEpic = combineEpics(
  blocklistEpic
);

export const combinedReducer = combineReducers({
  blocklist: blocklistReducer,
})
