import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import {headBlockInfoReducer, headBlockInfoEpic} from './components/HeadBlockInfo/HeadBlockInfoReducer';

export const infoPageEpic = combineEpics(
  headBlockInfoEpic
);

export const infoPageReducer = combineReducers({
  headBlockInfo: headBlockInfoReducer,
})
