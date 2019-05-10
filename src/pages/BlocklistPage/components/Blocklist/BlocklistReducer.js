/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { interval, of } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, catchError, delay, startWith } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `BlocklistPage/Blocklist/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const POLLING_START = actionPrefix + `POLLING_START`;
const POLLING_STOP = actionPrefix + `POLLING_STOP`;
const FILTER_SET = actionPrefix + `FILTER_SET`;
const FILTER_TOGGLE = actionPrefix + `FILTER_TOGGLE`;
const RECORDS_UPDATE = actionPrefix + `RECORDS_UPDATE`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });
export const filterSet = (enabled) => ({ type: FILTER_SET, enabled});
export const filterToggle = () => ({ type: FILTER_TOGGLE });
export const recordsUpdate = (count) => ({ type: RECORDS_UPDATE, recordsCount: count });

//Epic
const startEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mapTo(fetchStart()),
);

const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(POLLING_START),
  mergeMap(action =>
    interval(1000).pipe(
      startWith(0),
      mergeMap(action => {
          let { value: { blocklistPage: { blocklist: { filter, records } } }} = state$;
          // let { value: { actionlistPage: { actionlist: { smartContractName, records } }} } = state$;
          let params = { records_count: records, show_empty: !filter };
          let query = paramsToQuery(params);

          return apiMongodb(`get_blocks${query}`).pipe(
            map(res => fetchFulfilled(res.response)),
            catchError(error => {
              errorLog("Blocks page/ get block list error",error);
              return of(fetchRejected(error.response, { status: error.status }))
            })
          )
        }),
      takeUntil(action$.pipe(
        ofType(POLLING_STOP, POLLING_START, FETCH_REJECTED)
      ))
    )
  ),
);

const repollEpic = action$ => action$.pipe(
  ofType(FETCH_REJECTED),
  delay(10000),
  mapTo(pollingStart()),
);

const filterToggleEpic = action$ => action$.pipe(
  ofType(FILTER_TOGGLE),
  mapTo(pollingStart()),
);

const recordsUpdateEpic = action$ => action$.pipe(
  ofType(RECORDS_UPDATE),
  mapTo(pollingStart()),
);


export const combinedEpic = combineEpics(
  startEpic,
  fetchEpic,
  repollEpic,
  filterToggleEpic,
  recordsUpdateEpic
);


//Reducer
const dataInitState = {
  payload: [],
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

    case RECORDS_UPDATE:
      return {
        ...state
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

const filterReducer = (state = false, action) => {
  switch (action.type) {
    case FILTER_SET:
      return !!action.enabled;

    case FILTER_TOGGLE:
      return !state;

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
  isFetching: isFetchingReducer,
  filter: filterReducer,
  records: recordsReducer
})
