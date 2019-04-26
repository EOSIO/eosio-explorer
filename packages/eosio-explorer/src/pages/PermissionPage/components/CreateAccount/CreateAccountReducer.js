import { combineReducers } from 'redux';
import {  of, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import { Keygen } from 'eosjs-keygen';
import { errorLog } from 'helpers/error-logger';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `PermissionPage/CreateAccount/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });

//Epic
const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>{
    return from(new Promise(
        (resolve, reject) =>
          {
            Keygen.generateMasterKeys()
              .then((keys)=>{
                resolve({
                  response:{
                    ownerPublicKey: keys.publicKeys.owner,
                    ownerPrivateKey: keys.privateKeys.owner,
                    activePublicKey: keys.publicKeys.active,
                    activePrivateKey: keys.privateKeys.active
                  }
                })
              })
              .catch((err)=>{
                reject(err);
              })
          })
      ).pipe(
      map(res => fetchFulfilled(res.response)),
      catchError(error => {
        errorLog(error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  })
);


export const combinedEpic = combineEpics(
  fetchEpic,
);


//Reducer
const dataInitState = {
  payload: {
    ownerPublicKey: "",
    ownerPrivateKey: "",
    activePublicKey: "",
    activePrivateKey: ""
  },
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
  isFetching: isFetchingReducer,
})
