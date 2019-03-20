import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as headblockEpic, combinedReducer as headblockReducer} from './components/Headblock/HeadblockReducer';

export const combinedEpic = combineEpics(
  headblockEpic
);

export const combinedReducer = combineReducers({
  headblock: headblockReducer,
})
