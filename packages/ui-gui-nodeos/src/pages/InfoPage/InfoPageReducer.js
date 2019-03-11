import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import HeadBlockInfoReducer from './components/HeadBlockInfo/HeadBlockInfoReducer';

import { fetchHeadBlockEpic } from './components/HeadBlockInfo/HeadBlockInfoEpic';

export const infoPageEpic = combineEpics(
  fetchHeadBlockEpic
);

export const infoPageReducer = combineReducers({
  headBlockInfo: HeadBlockInfoReducer,
})
