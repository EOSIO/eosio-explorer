/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, map, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import apiRpc from 'services/api-rpc';
import paramsToQuery from 'helpers/params-to-query';
import { errorLog } from 'helpers/error-logger';


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
const CREATE_START = actionPrefix + `CREATE_START`;
const CREATE_FULFILLED = actionPrefix + `CREATE_FULFILLED`;
const CREATE_REJECTED = actionPrefix + `CREATE_REJECTED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const defaultSet = ( id ) => ({ type: DEFAULT_SET, id });
export const accountAdd = accountData => ({ type: ACCOUNT_ADD, accountData });
export const accountImport = accountData => ({ type: ACCOUNT_IMPORT, accountData });
export const accountClear = endpoint => ({ type: ACCOUNT_CLEAR, endpoint });
export const createStart = account => ({ type: CREATE_START, account });
export const createFulfilled = payload => ({ type: CREATE_FULFILLED, payload });
export const createRejected = ( payload, error ) => ({ type: CREATE_REJECTED, payload, error });

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
      catchError(error => {
        errorLog(error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  })
);

const createAccountPromise = (
  query, owner_private_key, active_private_key, accountName
) => new Promise(
  (resolve, reject) => {
    apiRpc("create_account", query)
      .then(res => resolve({
        ownerPrivateKey: owner_private_key,
        activePrivateKey: active_private_key,
        accountName: accountName
      }))
      .catch(err => reject(err));
  }
);

const createEpic = action$ => action$.pipe(
  ofType(CREATE_START),
  mergeMap(
    action => {
      let { account: { accountName, ownerPublicKey, activePublicKey, ownerPrivateKey, activePrivateKey }} = action;
      let query = {
        new_account_name: accountName,
        new_account_owner_key: ownerPublicKey,
        new_account_active_key: activePublicKey
      };
      return from(createAccountPromise(query, ownerPrivateKey, activePrivateKey, accountName))
        .pipe(
          mergeMap(response => {
          return apiMongodb(`get_account_details${paramsToQuery({account_name: accountName})}`)
            .pipe(
              map(res => createFulfilled({
                baseData: response,
                queryData: res.response
              })),
              catchError(err => of(createRejected(err.message, { status: err })))
            );
          }),
          catchError(
            err => {
              return of(createRejected(err.message, { status: err }))
            }
          )
        );
    }
  )
);

export const combinedEpic = combineEpics(
  fetchEpic,
  createEpic
);

const dataInitState = {
  list: [
    {
      _id: '1',
      account: 'eosio',
      permission: 'owner',
      public_key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
      private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    },
    {
      _id: '2',
      account: 'eosio',
      permission: 'active',
      public_key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
      private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
    }
  ],
  importSuccess: false,
  importError: null,
  submitError: null,
  isSubmitting: false,
  creationSuccess: false,
  defaultId: "1"
}

const reinitializedState = (endpoint = {
  nodeos: "http://localhost:8888",
  mongodb: "mongodb://localhost:27017/mongopluginmainnet"
}) => {
  return {
    list: (
      endpoint["nodeos"] === 'http://localhost:8888' &&
      endpoint["mongodb"] === 'mongodb://localhost:27017/mongopluginmainnet'
    ) ? [
      {
        _id: '1',
        account: 'eosio',
        permission: 'owner',
        public_key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
        private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
      },
      {
        _id: '2',
        account: 'eosio',
        permission: 'active',
        public_key: 'EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV',
        private_key: '5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'
      }
    ] : [],
    importSuccess: false,
    importError: null,
    submitError: null,
    isSubmitting: false,
    creationSuccess: false,
    defaultId: "1"
  }
};

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

const composePermissionList = (originalList = [], payloadList = []) => {
  payloadList.map(function(el) {    
    let index = originalList.findIndex(eachItem => el.account === eachItem.account && el.permission === eachItem.permission);
    if (index >= 0) {
      if (originalList[index].public_key !== el.public_key) {
        originalList[index].public_key = el.public_key;
        originalList[index].private_key = null;
      }            
    } else {
      originalList.push(el);
    }
    return null;       
  });  
  return originalList;
}

const addKeysToAccount = (accountData, list) => {
  let updatedList = list.slice(0);
  let activeItem = updatedList.findIndex(el => (accountData.accountName === el.account && el.permission === 'active'));
  let ownerItem = updatedList.findIndex(el => (accountData.accountName === el.account && el.permission === 'owner'));
  updatedList[activeItem]["private_key"] = accountData.activePrivate;
  updatedList[ownerItem]["private_key"] = accountData.ownerPrivate;
  return updatedList;
}

const storeNewAccount = (createResponse, list) => {
  let {
    baseData: { ownerPrivateKey, activePrivateKey, accountName },
    queryData
  } = createResponse;
  let accountSuccess = true;
  let msg = `Successfully created the account for ${accountName}`;

  if (queryData && queryData.length > 0) {
    queryData[0]["private_key"] = (queryData[0].permission === 'owner') ? ownerPrivateKey : activePrivateKey;
    queryData[1]["private_key"] = (queryData[1].permission === 'owner') ? ownerPrivateKey : activePrivateKey;
  } else {
    msg = `Created the account for ${accountName} but failed to query the 
       account after creation. Please import the keys you just used in the previous 
       panel.`;
    accountSuccess = false;
  }

  let oldList = list.slice(0);
  let updatedList = oldList.concat(queryData);
  updatedList.sort(alphabeticalSort);

  return {
    newList: updatedList,
    message: msg,
    success: accountSuccess
  };

}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_FULFILLED:
      return {
        ...state,
        creationSuccess: false,
        isSubmitting: false,
        submitError: null,
        list: composePermissionList(action.payload.originalList, action.payload.response)
      };
    case DEFAULT_SET:
      return {
        ...state,
        creationSuccess: false,
        submitError: null,
        isSubmitting: false,
        defaultId: action.id
      };
    case ACCOUNT_ADD:
      return {
        ...state,
        list: addKeysToAccount(action.accountData, state.list),
        creationSuccess: false,
        isSubmitting: false,
        submitError: null,
        importSuccess: true
      };
    case ACCOUNT_IMPORT:
      return {
        ...state,
        keysData: action.accountData,
        creationSuccess: false,
        isSubmitting: false,
        submitError: null,
        importSuccess: false
      };
    case CREATE_START:
      return {
        ...state,
        creationSuccess: false,
        submitError: null,
        isSubmitting: true
      };
    case CREATE_FULFILLED:
      let { newList, message, success } = storeNewAccount(action.payload, state.list);
      return {
        ...state,
        list: newList,
        isSubmitting: false,
        submitError: (!success) ? message : null,
        creationSuccess: success
      };
    case CREATE_REJECTED:
      return {
        ...state,
        submitError: action.payload,
        creationSuccess: false,
        isSubmitting: false
      };
    case ACCOUNT_CLEAR:
      return reinitializedState(action.endpoint, dataInitState);
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
