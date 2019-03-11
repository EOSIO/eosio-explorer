import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { counterReducer } from './counter';

import { infoPageEpic, infoPageReducer } from '../pages/InfoPage/InfoPageReducer';


export const rootEpic = combineEpics(
  infoPageEpic
);

export const rootReducer = combineReducers({
  counter: counterReducer,
  info: infoPageReducer,
})
