/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { mergeMap, mapTo, filter } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';


// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `errorlog/`;

//Action Type
const LOG_START = actionPrefix + `LOG_START`;
const LOG_RESET = actionPrefix + `LOG_RESET`;
const PANEL_SET = actionPrefix + `PANEL_SET`;

//Action Creator
export const logStart = () => ({ type: LOG_START });
export const logReset = () => ({ type: LOG_RESET });
export const panelSet = (status) => ({ type: PANEL_SET, status });

//Epic
const panelOpenEpic = action$ => action$.pipe(
  filter(action => action.type === PANEL_SET && action.status === "OPEN"),
  mapTo(logReset()),
);


export const combinedEpic = combineEpics(
  panelOpenEpic,
);


//Reducer
// const dataInitState = {
//   unseen: 0
// }

const dataReducer = (state={ unseen: 0, status: "CLOSE" }, action) => {
  switch (action.type) {
    case LOG_START:
      return {
        ...state,
        unseen: state.status !== "OPEN" ? state.unseen + 1 : 0,
        status: state.status !== "OPEN" ? "MINIMISE" : "OPEN",
      };
    case LOG_RESET:
      return {
        ...state,
        unseen: 0
      };
    case PANEL_SET:
      return {
        ...state,
        status: action.status !== "UNOPEN"
                  ? action.status
                  : state.status === "OPEN"
                    ? "MINIMISE"
                    : state.status
      };
    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  data: dataReducer,
})
