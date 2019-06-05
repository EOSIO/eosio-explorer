/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { throwError, of } from 'rxjs';
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
const ACCOUNT_EDIT = actionPrefix + `ACCOUNT_EDIT`;
const EDIT_SUCCESS = actionPrefix + `EDIT_SUCCESS`;
const EDIT_REJECTED = actionPrefix + `EDIT_REJECTED`;
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
export const accountClear = chainId => ({ type: ACCOUNT_CLEAR, chainId });
export const accountEdit = accountData => ({ type: ACCOUNT_EDIT, accountData });
export const editSuccess = payload => ({ type: EDIT_SUCCESS, payload });
export const editRejected = ( payload, error ) => ({ type: EDIT_REJECTED, payload, error });
export const createStart = account => ({ type: CREATE_START, account });
export const createFulfilled = payload => ({ type: CREATE_FULFILLED, payload });
export const createRejected = ( payload, error ) => ({ type: CREATE_REJECTED, payload, error });

export const LOCAL_CHAIN_ID = "32b303dbe6bc3cf9a0d28fbdc95ea3cd18310923ac20f11fab3ca5ab4f18f135";

const MAX_ACCOUNT_TO_SHOW = 200;
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
        errorLog("Manage accounts page/ get all permissions error",error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  })
);

const createAccountObservable = (
  query, owner_private_key, active_private_key, accountName
) =>
  apiRpc("create_account", query).pipe(
    map(res => ({
      ownerPrivateKey: owner_private_key,
      activePrivateKey: active_private_key,
      accountName: accountName
    })),
    catchError(err => throwError(err))
  )
  
  const editAccountObservable = query => {
    //get parent of the current permission to be edited
    return apiRpc("get_account_details",{account_name: query.account_name})
      .pipe(
        mergeMap(res => {
          let index = res.permissions.findIndex(eachPermission => eachPermission.perm_name === query.permission_to_update);
          if(index > -1){
            console.log("query before permission", query.permission);
            console.log("query before private_key", query.private_key);
            query["parent"] = res.permissions[index].parent;
            //If the owner private key is not available then try with parent private key to edit keys
            if(query.private_key === ""){
              query["permission"] = res.permissions[index].parent;
            }            
            return apiRpc("update_auth", query)
              .pipe(
                map(res => res),
                catchError(err => throwError(err))
              )
          }else{
            return throwError({"message": `Parent not found for the permission ${query.permission}`});
          }          
        }),
      catchError(error => throwError(error))
    )
  }

 
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
      return createAccountObservable(query, ownerPrivateKey, activePrivateKey, accountName)
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

const updateEpic = action$ => action$.pipe(
  ofType(ACCOUNT_EDIT),
  mergeMap(
    action => {
      let { accountData: {
        accountName, accountOwnerPrivateKey, publicKey, privateKey, permission
      } } = action;
      let query = {
        actor: accountName,
        permission: "owner",
        permission_to_update: permission,
        account_name: accountName,
        private_key: accountOwnerPrivateKey
      };

      query["new_key"] = publicKey;

      let baseData = {
        permission: permission,
        privateKey: privateKey,
        accountName: accountName
      }

      return editAccountObservable(query)
        .pipe(
          mergeMap(response => {
            return apiMongodb(`get_account_details${paramsToQuery({account_name: baseData.accountName})}`)
              .pipe(
                map(res => editSuccess({
                  baseData: baseData,
                  queryData: res.response
                })),
                catchError(err => of(editRejected(err.message, { status: err })))
              );
          }),
          catchError(
            err => {
              return of(editRejected(err.message, {status: err }))
            }
          )
        );
    }
  )
);

export const combinedEpic = combineEpics(
  fetchEpic,
  createEpic,
  updateEpic
);

const initData = [];

const dataInitState = {
  list: navigator.userAgent !== 'ReactSnap'
   ? initData : [],
  importSuccess: false,
  importError: null,
  submitError: null,
  isSubmitting: false,
  creationSuccess: false,
  defaultId: null,
}

const reinitializedState = (
  chainId = LOCAL_CHAIN_ID, oldList
) => {
  let eosioPerms = oldList.filter(el => 
    el.account === 'eosio' && el.private_key && el.public_key
  );
  return {
    list: (
      chainId === LOCAL_CHAIN_ID
    ) ? [...eosioPerms] : [],
    importSuccess: false,
    importError: null,
    submitError: null,
    isSubmitting: false,
    creationSuccess: false,
    defaultId: null,
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

const hasPrivateKey = (item) => {
  return (!!item.private_key);
}  

const initializeDefaultId = (stateId, list) => {
  let eosio_owner = list.filter(
    el => el.private_key && el.account === 'eosio' && el.permission === 'owner'
  )[0];
  let currentDefault = list.filter(el => el._id === stateId)[0];
  let defaultId = list.filter(el => el.private_key)[0];

  if (!stateId) {
    return (eosio_owner) ? eosio_owner._id : defaultId;
  } else {
    let currentDefaultExists = (currentDefault) ? currentDefault.private_key : null;
    return (currentDefaultExists) ? currentDefault._id :
      (eosio_owner) ? eosio_owner._id : defaultId;
  }
}

const composePermissionList = (originalList = [], payloadList = []) => {
  // Check if any keys were deleted using `updateauth`
  let clonedList = originalList.slice(0);  
  let newList = clonedList.filter(
    item => {
      return hasPrivateKey(item) && payloadList.findIndex(eachItem => item.account === eachItem.account && item.permission === eachItem.permission) > -1;
    }
  );
  payloadList.map(function(el) {
    let index = newList.findIndex(eachItem => el.account === eachItem.account && el.permission === eachItem.permission);
    if (index >= 0) {
      if (newList[index].public_key !== el.public_key) {
        newList[index]._id = el._id;
        newList[index].public_key = el.public_key;
        newList[index].private_key = null;
      }else{
        newList[index]._id = el._id;
      }
    } else {
      if (el.account === 'eosio' && el.private_key === undefined && el.public_key && 
        (el.permission === 'owner' || el.permission === 'active')) {
        /**
         * If the eosio account made from our tool is initialized state and has no private key in local storage,
         * we assign the corresponding private key to the public key in the database. This only applies for
         * owner and/or active permissions. Otherwise, we do nothing
         */
        if (el.public_key === "EOS5GnobZ231eekYUJHGTcmy2qve1K23r5jSFQbMfwWTtPB7mFZ1L") {
          el.private_key = "5Jr65kdYmn33C3UabzhmWDm2PuqbRfPuDStts3ZFNSBLM7TqaiL";
        }       
      }
      if(newList.length < MAX_ACCOUNT_TO_SHOW)
        newList.push(el);
    }
    return null;
  });
  newList.sort(alphabeticalSort);
  return newList;
}

const addKeysToAccount = (accountData, list) => {
  let updatedList = list.slice(0);
  let index = updatedList.findIndex(el => (accountData.accountName === el.account && el.permission === accountData.permission));
  updatedList[index].private_key = accountData.privateKey;
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

const updateAccountList = (createResponse, list, defaultId) => {
  let {
    baseData: { permission, privateKey, accountName },
    queryData
  } = createResponse;
  let accountSuccess = true;
  let msg = `Successfully updated the keys for ${accountName}`;
  let updatedList = list.slice(0);

  if (queryData && queryData.length > 0) {
    let index = updatedList.findIndex(item => item.account === accountName && item.permission === permission);
    let updatedAccount = queryData.filter(el => el.permission === permission)[0];    
    updatedList[index].public_key = updatedAccount.public_key;
    updatedList[index].private_key = privateKey;
    //set new id as default id if the the permisssion was default permission
    if(defaultId === updatedList[index]._id){
      updatedList[index]._id = updatedAccount._id;
      defaultId = updatedList[index]._id;
    }else{
      updatedList[index]._id = updatedAccount._id;
    }       
  } else {
    msg = `Updated the keys for ${accountName} but failed to query the
       account after creation. Please import the keys you just used in the previous
       panel.`;
    accountSuccess = false;
  }

  updatedList.sort(alphabeticalSort);

  return {
    updatedList: updatedList,
    updatedMsg: msg,
    updatedSuccess: accountSuccess,
    defaultId: defaultId
  };

}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_FULFILLED:
      let composedList = composePermissionList(action.payload.originalList, action.payload.response);
      return {
        ...state,
        creationSuccess: false,
        isSubmitting: false,
        submitError: null,
        list: composedList,
        defaultId: initializeDefaultId(state.defaultId, composedList),
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
    case ACCOUNT_EDIT:
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
    case EDIT_SUCCESS:
      let { updatedList, updatedMsg, updatedSuccess, defaultId } = updateAccountList(action.payload, state.list, state.defaultId);
      return {
        ...state,
        defaultId: defaultId,
        list: updatedList,
        isSubmitting: false,
        submitError: (!updatedSuccess) ? updatedMsg : null,
        creationSuccess: updatedSuccess
      };
    case EDIT_REJECTED:
    case CREATE_REJECTED:
      return {
        ...state,
        submitError: action.payload,
        creationSuccess: false,
        isSubmitting: false
      };
    case ACCOUNT_CLEAR:
      return reinitializedState(action.chainId, state.list);
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
