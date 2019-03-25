/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `permission/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const DEFAULT_SET = actionPrefix + `DEFAULT_SET`;
const ACCOUNT_UPDATE = actionPrefix + `ACCOUNT_UPDATE`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const defaultSet = ( id ) => ({ type: DEFAULT_SET, id });
export const accountUpdate = accountData => ({ type: ACCOUNT_UPDATE, accountData });

//Epic

const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action =>{
    let {
      value: {
        permission: {
          data: {
            defaultId,
            list
          }
        }
      }
    } = state$;

    return apiMongodb(`get_all_permissions`).pipe(
      map(res => fetchFulfilled({
        response: res.response,
        originalList: list,
        originalDefault: defaultId
      })),
      catchError(error => of(fetchRejected(error.response, { status: error.status })))
    )
  })
);


export const combinedEpic = combineEpics(
  fetchEpic,
);


//Reducer
const dataInitState = {
  list: [
    {
      _id: '1',
      account: 'eosio',
      permission: 'owner',
      public_key: '123456',
      private_key: '789'
    },
    {
      _id: '2',
      account: 'eosio',
      permission: 'active',
      public_key: 'abcdef',
      private_key: 'zyx'
    },
  ],
  defaultId: "1"
}

const accountState = {
  keysData: []
}

const composePermissionList = (originalList, payloadList) => {
  let composedList = originalList.concat(
    payloadList.filter(item => {
      return originalList.findIndex(el => el._id === item._id) < 0
    })
  );
  return composedList;
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_FULFILLED:
      return {
        ...state,
        list: composePermissionList(action.payload.originalList, action.payload.response)
      };
    case DEFAULT_SET:
      return {
        ...state,
        defaultId: action.id
      };
    default:
      return state;
  }
};

const accountReducer = (state=accountState, action) => {
  switch (action.type) {
    case ACCOUNT_UPDATE:
      return {
        ...state,
        keysData: action.accountData
      };
    default:
      return state;
  }
}

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
  account: accountReducer
})
