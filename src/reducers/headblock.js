/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { switchMap, mapTo, map, takeUntil, catchError, delay, startWith, exhaustMap } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import apiPostgres from 'services/api-postgres';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `headblock/`;

//Action Type
export const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const POLLING_START = actionPrefix + `POLLING_START`;
const POLLING_STOP = actionPrefix + `POLLING_STOP`;

//Action Creator
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });

//Epic

const pollingEpic = ( action$, state$ ) => action$.pipe(
  ofType(POLLING_START),
  switchMap(action =>
    interval(process.env.REACT_APP_POLLING_INTERVAL_TIME).pipe(
      startWith(-1),
      exhaustMap(index => {
        let query = paramsToQuery({ records_count: "1", show_empty: "true" });

        return apiPostgres(`get_blocks${query}`).pipe(
          map(res => fetchFulfilled(res.response)),
          catchError(error => {
            errorLog("Info page/ get latest block error",error);
            return of(fetchRejected(error.response, { status: error.status }))
          })
        )
      }),
      takeUntil(action$.pipe(
        ofType(POLLING_STOP, POLLING_START, FETCH_REJECTED),
      )),
    )
  ),
);

const autoReloadEpic = action$ => action$.pipe(
  ofType(FETCH_REJECTED),
  delay(process.env.REACT_APP_AUTO_RELOAD_INTERVAL_TIME),
  mapTo(pollingStart()),
);

export const combinedEpic = combineEpics(
  pollingEpic,
  autoReloadEpic
);


//Reducer
const dataInitState = {
  payload: [],
  error: undefined
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case POLLING_START:
    return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload !== null ? action.payload : [],
        error: undefined
      };
    case FETCH_REJECTED:
      return {
        ...state,
        payload: [],
        error: action.error
      };
    default:
      return state;
  }
};

const isPollingReducer = (state = false, action) => {
  switch (action.type) {
    case POLLING_START:
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
  isPolling: isPollingReducer
})
