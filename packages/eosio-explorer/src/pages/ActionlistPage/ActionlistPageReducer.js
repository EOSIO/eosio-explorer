import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as actionlistEpic, combinedReducer as actionlistReducer } from './components/Actionlist/ActionlistReducer';

export const combinedEpic = combineEpics(
  actionlistEpic
);

export const combinedReducer = combineReducers({
  actionlist: actionlistReducer,
})
