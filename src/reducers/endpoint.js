/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';


// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `endpoint/`;

//Action Type
export const CONNECT_START = actionPrefix + `CONNECT_START`;
const CONNECT_FULFILLED = actionPrefix + `CONNECT_FULFILLED`;

//Action Creator
export const connectStart = (nodeos) => ({ type: CONNECT_START, nodeos });
export const connectFulfilled = payload => ({ type: CONNECT_FULFILLED, payload });

// Epic
const connectEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_START),
  mergeMap(action =>{      
      return of(connectFulfilled(action.nodeos));
    }
  )
);


export const combinedEpic = combineEpics(
  connectEpic
);

//Reducer
let hostname = window.location.hostname;
export const pathInitState = {  
  nodeos: `http://${hostname}:8888`
}

const pathReducer = (state=pathInitState, action) => {
  switch (action.type) {
    case CONNECT_START:
      return {
        nodeos: action.nodeos
      };
    case CONNECT_FULFILLED:
      return {
        nodeos: state.nodeos
      };
    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  path: pathReducer
});
