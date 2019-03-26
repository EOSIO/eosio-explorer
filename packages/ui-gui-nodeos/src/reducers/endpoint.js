/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `InfoPage/Nodeswitch/`;

//Action Type
const CONNECT_START = actionPrefix + `CONNECT_START`;
// const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
// const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

//Action Creator
export const connectStart = (nodeos, mongodb) => ({ type: CONNECT_START, nodeos, mongodb });
//Epic
// const fetchEpic = action$ => action$.pipe(
//   ofType(FETCH_START),
//   mergeMap(action =>
//     apiMongodb(`get_block_latest`).pipe(
//       map(res => fetchFulfilled(res.response)),
//       catchError(error => of(fetchRejected(error.response, { status: error.status })))
//     )
//   )
// );

export const combinedEpic = combineEpics(
  // fetchEpic
);


//Reducer
const endpointInitState = {
  nodeos: "http://localhost:8888/",
  mongodb: "mongodb://localhost:27017/mongopluginmainnet/",
}

const endpointReducer = (state=endpointInitState, action) => {
  switch (action.type) {
    case CONNECT_START:
      return {
        ...state,
        nodeos: action.nodeos,
        mongodb: action.mongodb,
      };

    default:
      return state;
  }
};

export const combinedReducer = endpointReducer;
