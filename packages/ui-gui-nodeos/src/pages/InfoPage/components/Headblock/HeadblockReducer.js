/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, mapTo, map, takeUntil } from 'rxjs/operators';

import { combineEpics } from 'redux-observable';
import { ofType } from 'redux-observable';

//Action Type
const FETCH_START = 'Headblock/FETCH_START';
const FETCH_FULFILLED = 'Headblock/FETCH_FULFILLED';
const FETCH_REJECTED = 'Headblock/FETCH_REJECTED';
const POLLING_START = 'Headblock/POLLING_START';
const POLLING_STOP = 'Headblock/POLLING_STOP';

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = payload => ({ type: FETCH_REJECTED, payload });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });

//Epic
const startEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mapTo({ type: FETCH_START }),
);

const fetchEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mergeMap(action =>
    interval(500).pipe(
      mergeMap(action =>
        ajax.getJSON(`/api/mongodb/get_block_latest`).pipe(
        map(response => fetchFulfilled(response))
      )),
      takeUntil(action$.pipe(
        ofType(POLLING_STOP)
      ))
    )
  ),
);

export const headblockEpic = combineEpics(
  startEpic,
  fetchEpic
);


//Reducer
const initialState = {
  payload: {},
  error: {}
}

const dataReducer = (state=initialState, action) => {
    switch (action.type) {
      case FETCH_START:
          return initialState;

      case FETCH_FULFILLED:
        return {
          ...state,
          payload: action.payload
        };
      case FETCH_REJECTED:
        return {
          ...state,
          error: action.payload
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

export const headblockReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer
})
