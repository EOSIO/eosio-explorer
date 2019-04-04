/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, catchError, delay } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';


// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `errorlog/`;

//Action Type
const LOG_START = actionPrefix + `LOG_START`;
const LOG_RESET = actionPrefix + `LOG_RESET`;
const PANEL_OPEN = actionPrefix + `PANEL_OPEN`;
const PANEL_CLOSE = actionPrefix + `PANEL_CLOSE`;

//Action Creator
export const logStart = () => ({ type: LOG_START });
export const logReset = () => ({ type: LOG_RESET });
export const panelOpen = () => ({ type: PANEL_OPEN });
export const panelClose = () => ({ type: PANEL_CLOSE });

//Epic
const panelOpenEpic = action$ => action$.pipe(
  ofType(PANEL_OPEN),
  mapTo(logReset()),
);


export const combinedEpic = combineEpics(
  panelOpenEpic,
);


//Reducer
// const dataInitState = {
//   unseen: 0
// }

const dataReducer = (state={ unseen: 0, isPanelOpen: false }, action) => {
  switch (action.type) {
    case LOG_START:
      return {
        ...state,
        unseen: !state.isPanelOpen ? state.unseen + 1 : 0
      };
    case LOG_RESET:
      return {
        ...state,
        unseen: 0
      };
    case PANEL_OPEN:
      return {
        ...state,
        isPanelOpen: true
      };
    case PANEL_CLOSE:
      return {
        ...state,
        isPanelOpen: false
      };
    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  data: dataReducer,
})
