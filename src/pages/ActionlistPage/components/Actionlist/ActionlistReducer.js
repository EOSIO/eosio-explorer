/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, mapTo, map, catchError } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `ActionlistPage/Actionlist/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const SMART_CONTRACT_NAME_UPDATE = actionPrefix + `SMART_CONTRACT_NAME_UPDATE`;
const RECORDS_UPDATE = actionPrefix + `RECORDS_UPDATE`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const smartContractNameSearch = (name) => ({ type: SMART_CONTRACT_NAME_UPDATE , smartContractName: name});
export const recordsUpdate = (count) => ({ type: RECORDS_UPDATE, recordsCount: count });

//Epic
const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action => {
    let { value: { actionlistPage: { actionlist: { smartContractName, records } }} } = state$;
    let params = { records_count: records };

    if(smartContractName)
      params.account_name = smartContractName.toLowerCase();

    let query = paramsToQuery(params);
    
    return apiMongodb(`get_actions${query}`).pipe(
      map(res => fetchFulfilled(res.response)),
      catchError(error => {
        errorLog("Action page/ get action list error",error);
        return of(fetchRejected(dataInitState.payload, { status: error }))
      })
    )
  }),
);

const smartContractNameToggleEpic = action$ => action$.pipe(
  ofType(SMART_CONTRACT_NAME_UPDATE),
  mapTo(fetchStart()),
);

const recordsUpdateEpic = action$ => action$.pipe(
  ofType(RECORDS_UPDATE),
  mapTo(fetchStart()),
);

export const combinedEpic = combineEpics(
  fetchEpic,
  smartContractNameToggleEpic,
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
        error: undefined,
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

const smartContractNameReducer = (state = "", action) => {
  switch (action.type) {
    case SMART_CONTRACT_NAME_UPDATE:
      return action.smartContractName;

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
  smartContractName: smartContractNameReducer,
  records: recordsReducer
})
