/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, map, mapTo, filter, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiRpc from 'services/api-rpc';
import { errorLog } from 'helpers/error-logger';
import apiMongodb from 'services/api-mongodb';
import paramsToQuery from 'helpers/params-to-query';
// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `AccountdetailPage/Accountdetail/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const PARAMS_SET = actionPrefix + `PARAMS_SET`;
const FETCH_CONTRACT_START = actionPrefix + `FETCH_CONTRACT_START`;
const FETCH_CONTRACT_FULFILLED = actionPrefix + `FETCH_CONTRACT_FULFILLED`;
const FETCH_CONTRACT_REJECTED = actionPrefix + `FETCH_CONTRACT_REJECTED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const paramsSet = (params) => ({ type: PARAMS_SET, params });
export const fetchContractStart = () => ({ type: FETCH_CONTRACT_START });
export const fetchContractFulfilled = contractPayload => ({ type: FETCH_CONTRACT_FULFILLED, contractPayload });
export const fetchContractRejected = ( contractPayload, contractError ) => ({ type: FETCH_CONTRACT_REJECTED, contractPayload, contractError });

//Epic

const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>{
    let { value: { accountdetailPage: { accountdetail: { params } }}} = state$;

    return apiRpc("get_block", {'block_num_or_id': params}).pipe(
      map(res => { console.log("Get-block res", res);
        return fetchFulfilled(res)}),
      catchError(error => {
        errorLog("Accounts page/ get account detail error ", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  })
);

const startContractFetchEpic = ( action$ ) => action$.pipe(
  filter(action => action.type === FETCH_FULFILLED && Object.keys(action.payload).length !== 0 ),
  mapTo(fetchContractStart()),
);

const fetchContractEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_CONTRACT_START),
  mergeMap(action =>{
    let { value: { accountdetailPage: { accountdetail: { params } }}} = state$;

    return apiMongodb(`get_abi${paramsToQuery(params)}`).pipe(
      map(res => fetchContractFulfilled(res.response)),
      catchError(error => {
        errorLog("Accounts page/ get abi error ", error);
        return of(fetchContractRejected(error.response, { status: error.status }))
      })
    )
  })
);

export const combinedEpic = combineEpics(
  fetchEpic,
  startContractFetchEpic,
  fetchContractEpic
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

const dataContractInitState = {
  contractPayload: [],
  contractError: undefined
}

const dataContractReducer = (state=dataContractInitState, action) => {
  switch (action.type) {
    case FETCH_CONTRACT_START:
        return dataContractInitState;

    case FETCH_CONTRACT_FULFILLED:
      return {
        ...state,
        contractPayload : action.contractPayload,
        contractError: undefined
      };
    case FETCH_CONTRACT_REJECTED:
      return {
        ...state,
        contractPayload: action.contractPayload,
        contractError: action.contractError
      };
    default:
      return state;
  }
};

const paramsReducer = (state = {}, action) => {
  switch (action.type) {
    case PARAMS_SET:
      return {
        ...state,
        ...action.params
      };

    default:
      return state;
  }
};


export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer,
  contractData: dataContractReducer,
  params: paramsReducer
})
