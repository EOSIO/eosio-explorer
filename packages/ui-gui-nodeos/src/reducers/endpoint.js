/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, mapTo, map, flatMap, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import { accountClear } from 'reducers/permission';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `endpoint/`;

//Action Type
export const CONNECT_START = actionPrefix + `CONNECT_START`;
const CONNECT_SWITCH = actionPrefix + `CONNECT_SWITCH`;
const CONNECT_FULFILLED = actionPrefix + `CONNECT_FULFILLED`;
const CONNECT_REJECTED = actionPrefix + `CONNECT_REJECTED`;
const CONNECT_RESET = actionPrefix + `CONNECT_RESET`;
const ERROR_RESET = actionPrefix + `ERROR_RESET`;

//Action Creator
export const connectStart = (nodeos, mongodb) => ({ type: CONNECT_START, nodeos, mongodb });
export const connectSwitch = (nodeos, mongodb) => ({ type: CONNECT_SWITCH, nodeos, mongodb });
export const connectFulfilled = payload => ({ type: CONNECT_FULFILLED, payload });
export const connectRejected = ( error ) => ({ type: CONNECT_REJECTED, error });
export const connectReset = () => ({ type: CONNECT_RESET });

export const errorReset = () => ({ type: ERROR_RESET });

// Epic
const connectEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_START),
  mergeMap(action =>{
      
      let {value: { endpoint: { path : { mongodbTemp }}}} = state$;

      return apiMongodb(`set_endpoint${paramsToQuery({path: mongodbTemp})}`).pipe(
        map(res => connectFulfilled(res.response)),
        catchError((error={}) => of(connectRejected(error.response)))
        )
    }
  )
);

const swapEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_SWITCH),
  mergeMap(action =>{
      
      let {value: { endpoint: { path : { mongodbTemp }}}} = state$;

      return apiMongodb(`set_endpoint${paramsToQuery({path: mongodbTemp})}`).pipe(
        flatMap(res => ([connectFulfilled(res.response), accountClear({
          nodeos: action.nodeos,
          mongodb: action.mongodb
        })])),
        catchError((error={}) => of(connectRejected(error.response)))
        )
    }
  )
);

const resetEpic = ( action$, state$ ) => action$.pipe(
  ofType(CONNECT_RESET),
  mapTo(connectStart(pathInitState.nodeos, pathInitState.mongodb)),
);


export const combinedEpic = combineEpics(
  connectEpic,
  swapEpic,
  resetEpic,
);


//Reducer
export const pathInitState = {
  nodeos: `http://localhost:8888`,
  mongodb: `mongodb://localhost:${process.env.REACT_APP_MONGODB_PORT}/${process.env.REACT_APP_MONGODB_DB_NAME}`,
}

const pathReducer = (state=pathInitState, action) => {
  switch (action.type) {
    case CONNECT_START:
    case CONNECT_SWITCH:
      return {
        nodeos: action.nodeos,
        mongodb: state.mongodb,
        mongodbTemp: action.mongodb,
      };
    case CONNECT_FULFILLED:
      return {
        nodeos: state.nodeos,
        mongodb: state.mongodbTemp,
      };
    case CONNECT_REJECTED:
      return {
        nodeos: state.nodeos,
        mongodb: state.mongodb,
      };;
    case CONNECT_RESET:
      return {...pathInitState};
    default:
      return state;
  }
};

const errorReducer = ( state="", action) =>{
  switch (action.type) {
    case ERROR_RESET:
      return "";
    case CONNECT_FULFILLED:
      return state;
    case CONNECT_REJECTED:
      return action.error ? action.error : "DB Connection Error";
    default:
      return state;
  }
}

export const combinedReducer = combineReducers({
  path: pathReducer,
  error: errorReducer,
})
;
