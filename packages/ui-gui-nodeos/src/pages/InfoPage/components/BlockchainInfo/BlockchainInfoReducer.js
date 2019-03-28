/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, map, catchError, mapTo } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiRpc from 'services/api-rpc';
import { CONNECT_START } from 'reducers/endpoint';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `InfoPage/BlockchainInfo/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });

//Epic

const query = {"privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"};

const fetchEpic = action$ => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>
    from(apiRpc("get_info", query)).pipe(
      map(res => fetchFulfilled(res)),
      catchError(error => of(fetchRejected(error.response, { status: error.status })))
    )
  ),
);

const endpointConnectEpic = action$ => action$.pipe(
  ofType(CONNECT_START),
  mapTo(fetchStart())
);


export const combinedEpic = combineEpics(
  fetchEpic,
  endpointConnectEpic
);


//Reducer
const dataInitState = {
  payload: {},
  error: undefined
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
        return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
        error: undefined
      };
    case FETCH_REJECTED:
      return {
        ...state,
        payload: action.payload,
        error: action.error
      };
    default:
      return state;
  }
};

const isFetchingReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_START:
      return true;

    case FETCH_FULFILLED:
    case FETCH_REJECTED:
      return false;

    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer
})
