import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { headblockReducer, headblockEpic } from './components/Headblock/HeadblockReducer';

export const infoPageEpic = combineEpics(
  headblockEpic
);

export const infoPageReducer = combineReducers({
  headblock: headblockReducer,
})
