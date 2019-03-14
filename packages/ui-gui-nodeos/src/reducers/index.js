import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { counterReducer } from './counter';

import { infoPageEpic, infoPageReducer } from '../pages/InfoPage/InfoPageReducer';
import { blocklistPageEpic, blocklistPageReducer } from '../pages/BlocklistPage/BlocklistPageReducer';


export const rootEpic = combineEpics(
  infoPageEpic,
  blocklistPageEpic,
);

export const rootReducer = combineReducers({
  counter: counterReducer,
  infoPage: infoPageReducer,
  blocklistPage: blocklistPageReducer,
})
