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
const ACCOUNT_ADD = actionPrefix + `ACCOUNT_ADD`;
const ACCOUNT_IMPORT = actionPrefix + `ACCOUNT_IMPORT`;
const ACCOUNT_CLEAR = actionPrefix + `ACCOUNT_CLEAR`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const defaultSet = ( id ) => ({ type: DEFAULT_SET, id });
export const accountAdd = accountData => ({ type: ACCOUNT_ADD, accountData });
export const accountImport = accountData => ({ type: ACCOUNT_IMPORT, accountData });
export const accountClear = () => ({ type: ACCOUNT_CLEAR });

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
  importSuccess: false,
  importError: null,
  defaultId: "1"
}

const accountState = {
  keysData: []
}

// Sort permission list by alphabetical order
const alphabeticalSort = (a, b) => {
  let acctNameA = a.account,
      acctNameB = b.account;
  if (acctNameA < acctNameB) 
    return -1;
  if (acctNameA > acctNameB)
    return 1;
  return 0;
}

const composePermissionList = (originalList, payloadList) => {
  let hash = Object.create(null);
  originalList.concat(payloadList).forEach(el => {
    hash[el._id] = Object.assign(hash[el._id] || {}, el);
  })
  let composedList = Object.keys(hash).map(k => hash[k]);
  composedList.sort(alphabeticalSort);
  return composedList;
}

const addKeysToAccount = (accountData, list) => {
  let updatedList = list.slice(0);
  let activeItem = updatedList.findIndex(el => (accountData.accountName === el.account && el.permission === 'active'));
  let ownerItem = updatedList.findIndex(el => (accountData.accountName === el.account && el.permission === 'owner'));
  updatedList[activeItem]["private_key"] = accountData.activePrivate;
  updatedList[ownerItem]["private_key"] = accountData.ownerPrivate;
  return updatedList;
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
    case ACCOUNT_ADD:
      return {
        ...state,
        list: addKeysToAccount(action.accountData, state.list),
        importSuccess: true
      };
    case ACCOUNT_IMPORT:
      return {
        ...state,
        keysData: action.accountData,
        importSuccess: false
      };
    case ACCOUNT_CLEAR:
      return dataInitState;
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
