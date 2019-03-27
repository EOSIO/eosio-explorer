/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `InfoPage/Nodeswitch/`;

//Action Type
const CONNECT_START = actionPrefix + `CONNECT_START`;
const CONNECT_FULFILLED = actionPrefix + `CONNECT_FULFILLED`;
const CONNECT_REJECTED = actionPrefix + `CONNECT_REJECTED`;

//Action Creator
export const connectStart = (nodeos, mongodb) => ({ type: CONNECT_START, nodeos, mongodb });
export const connectFulfilled = payload => ({ type: CONNECT_FULFILLED, payload });
export const connectRejected = ( payload, error ) => ({ type: CONNECT_REJECTED, payload, error });
// Epic
const connectEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_START),
  mergeMap(action =>{

      let {value: { endpoint: { mongodb }}} = state$;

      return apiMongodb(`set_endpoint${paramsToQuery({path: mongodb})}`).pipe(
        map(res => connectFulfilled(res.response)),
        catchError((error={}) => of(connectRejected(error.response, { status: error.status })))
        )
    }
  )
);

export const combinedEpic = combineEpics(
  connectEpic
);


//Reducer
const endpointInitState = {
  nodeos: "http://localhost:8888",
  mongodb: "mongodb://localhost:27017/mongopluginmainnet",
}

const endpointReducer = (state=endpointInitState, action) => {
  switch (action.type) {
    case CONNECT_START:
      return {
        ...state,
        nodeos: action.nodeos,
        mongodb: action.mongodb,
      };
    case CONNECT_FULFILLED:
    case CONNECT_REJECTED:
      return state;
    default:
      return state;
  }
};

export const combinedReducer = endpointReducer;
