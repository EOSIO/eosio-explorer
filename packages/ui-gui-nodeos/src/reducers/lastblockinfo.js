/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of, from } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, catchError, delay } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiRpc from 'services/api-rpc';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `lastblockinfo/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
export const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const POLLING_START = actionPrefix + `POLLING_START`;
const POLLING_STOP = actionPrefix + `POLLING_STOP`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });

const query = { "privateKey": "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3"};

//Epic
const startEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mapTo(fetchStart()),
);

const fetchEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mergeMap(action =>
    interval(500).pipe(
      mergeMap(action =>
        from(apiRpc("get_info", query)).pipe(
          map(res => fetchFulfilled(res)),
          catchError(error => of(fetchRejected(error.response, { status: error.status })))
        )
      ),
      takeUntil(action$.pipe(
        ofType(POLLING_STOP, POLLING_START, FETCH_REJECTED)
      ))
    )
  ),
);

const restartEpic = action$ => action$.pipe(
  ofType(FETCH_REJECTED),
  delay(10000),
  mapTo(pollingStart()),
);

export const combinedEpic = combineEpics(
  startEpic,
  fetchEpic,
  restartEpic
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
