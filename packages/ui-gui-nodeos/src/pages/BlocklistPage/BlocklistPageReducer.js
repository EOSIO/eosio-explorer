import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { blocklistReducer, blocklistEpic } from './components/Blocklist/BlocklistReducer';

export const blocklistPageEpic = combineEpics(
  blocklistEpic
);

export const blocklistPageReducer = combineReducers({
  blocklist: blocklistReducer,
})
