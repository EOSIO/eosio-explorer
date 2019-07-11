/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { switchMap, mapTo, map, takeUntil, catchError, delay, startWith, exhaustMap } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiPostgres from 'services/api-postgres';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `TransactionlistPage/Transactionlist/`;

//Action Type
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const POLLING_START = actionPrefix + `POLLING_START`;
const POLLING_STOP = actionPrefix + `POLLING_STOP`;
const RECORDS_UPDATE = actionPrefix + `RECORDS_UPDATE`;

//Action Creator
export const fetchFulfilled = (payload) => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = (payload, error) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = (autoReload) => ({ type: POLLING_START, autoReload });
export const pollingStop = () => ({ type: POLLING_STOP });
export const recordsUpdate = (count) => ({ type: RECORDS_UPDATE, recordsCount: count });

//Epic
const pollingEpic = (action$, state$) => action$.pipe(
  ofType(POLLING_START),
  switchMap(action =>
    interval(process.env.REACT_APP_POLLING_INTERVAL_TIME).pipe(
      startWith(-1),
      exhaustMap(index => {
        let { value: { transactionlistPage: { transactionlist: { records } }} } = state$;
        let params = { records_count: records };
        let query = paramsToQuery(params);

        return apiPostgres(`get_transactions${query}`).pipe(
          map(res => fetchFulfilled(res.response)),
          catchError(error => {
            errorLog("Transactions page/ get transaction list error",error);
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

const recordsUpdateEpic = action$ => action$.pipe(
  ofType(RECORDS_UPDATE),
  mapTo(pollingStart()),
);

const autoReloadEpic = action$ => action$.pipe(
  ofType(FETCH_REJECTED),
  delay(process.env.REACT_APP_AUTO_RELOAD_INTERVAL_TIME),
  mapTo(pollingStart(true)),
);

export const combinedEpic = combineEpics(
  pollingEpic,
  autoReloadEpic,
  recordsUpdateEpic
);


//Reducer
const dataInitState = {
  payload: [],
  error: undefined
}

const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case POLLING_START:

        //If this is a polling started from the auto reload, do not reinit the state.
        return !action.autoReload ? dataInitState : state;

    case FETCH_FULFILLED:
      return {
        ...state,
        payload: action.payload,
        error: undefined
      };

    case FETCH_REJECTED:
      return {
        ...state,

        //If current payload is having previous data, do not show the error
        error: state.payload.length > 0 ? undefined : action.error
      };

    case RECORDS_UPDATE:
      return {
        ...state
      };

    default:
      return state;
  }
};

const isPollingReducer = (state = false, action) => {
  switch (action.type) {
    case POLLING_START:

      //If this is a polling started from the auto reload, keep the flag false.
      return !action.autoReload;

    case FETCH_FULFILLED:
    case FETCH_REJECTED:
      return false;

    default:
      return state;
  }
};

const recordsReducer = (state = 100, action) => {
  switch (action.type) {
    case RECORDS_UPDATE:
      return action.recordsCount;

    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  data: dataReducer,
  isPolling: isPollingReducer,
  records: recordsReducer
})
