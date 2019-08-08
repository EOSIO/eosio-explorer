/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, mapTo, map, catchError, delay } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import apiPostgres from 'services/api-postgres';
import apiRpc from 'services/api-rpc';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `PushactionPage/Pushaction/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const ACTION_UPDATE = actionPrefix + `ACTION_UPDATE`;
const ACTION_PREFILL = actionPrefix + `ACTION_PREFILL`;
const ACTION_PUSH = actionPrefix + `ACTION_PUSH`;
const ACTION_PUSH_FULFILLED = actionPrefix + `ACTION_PUSH_FULFILLED`;
const ACTION_PUSH_REJECTED = actionPrefix + `ACTION_PUSH_REJECTED`;
const FETCH_SMART_CONTRACTS = actionPrefix + `FETCH_SMART_CONTRACTS`;
const FETCH_SMART_CONTRACTS_FULFILLED = actionPrefix + `FETCH_SMART_CONTRACTS_FULFILLED`;
const FETCH_SMART_CONTRACTS_REJECTED = actionPrefix + `FETCH_SMART_CONTRACTS_REJECTED`;
const RECORDS_UPDATE = actionPrefix + `RECORDS_UPDATE`;
const FILTER_UPDATE = actionPrefix + `FILTER_UPDATE`;
const PARAMS_SET = actionPrefix + `PARAMS_SET`;
const FETCH_ABI = actionPrefix + `FETCH_ABI`;
const FETCH_ABI_FULFILLED = actionPrefix + `FETCH_ABI_FULFILLED`;
const FETCH_ABI_REJECTED = actionPrefix + `FETCH_ABI_REJECTED`;
const FETCH_ACTION_DATA = actionPrefix + `FETCH_ACTION_DATA`;
const FETCH_ACTION_DATA_FULFILLED = actionPrefix + `FETCH_ACTION_DATA_FULFILLED`;
const FETCH_ACTION_DATA_REJECTED = actionPrefix + `FETCH_ACTION_DATA_REJECTED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = (actionsList) => ({ type: FETCH_FULFILLED, actionsList });
export const fetchRejected = (payload, error) => ({ type: FETCH_REJECTED, payload, error });
export const updateActionToPush = (updatedAction, defaultPermission) => ({ type: ACTION_UPDATE, updatedAction, defaultPermission });
export const prefillActionToPush = (updatedAction) => ({ type: ACTION_PREFILL, updatedAction });
export const actionPush = (action) => ({ type: ACTION_PUSH, actionToPush: action });
export const actionPushFulfilled = (response) => ({ type: ACTION_PUSH_FULFILLED, response });
export const actionPushRejected = (payload, error) => ({ type: ACTION_PUSH_REJECTED, payload, error });
export const fetchSmartContracts = () => ({ type: FETCH_SMART_CONTRACTS });
export const fetchFulfilledSmartContract = (payload) => ({ type: FETCH_SMART_CONTRACTS_FULFILLED, payload });
export const fetchRejectedSmartContract = (payload, error) => ({ type: FETCH_SMART_CONTRACTS_REJECTED, payload, error });
export const recordsUpdate = (count) => ({ type: RECORDS_UPDATE, recordsCount: count });
export const filterUpdate = (filter) => ({ type: FILTER_UPDATE, filter });
export const paramsSet = (params) => ({ type: PARAMS_SET, params });
export const fetchAbi = () => ({ type: FETCH_ABI });
export const fetchAbiFulfilled = (payload) => ({ type: FETCH_ABI_FULFILLED, payload });
export const fetchAbiRejected = (payload, error) => ({ type: FETCH_ABI_REJECTED, payload, error });
export const fetchActionData = (block_num, transaction_id, action_ordinal ) => ({ type: FETCH_ACTION_DATA, block_num, transaction_id, action_ordinal});
export const fetchActionDataFulfilled = (payload, transaction_id, action_ordinal) => ({ type: FETCH_ACTION_DATA_FULFILLED, payload, transaction_id, action_ordinal});
export const fetchActionDataRejected = (payload, error) => ({ type: FETCH_ACTION_DATA_REJECTED, payload, error });

//Epic
const fetchEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action => {
    let { value: { pushactionPage: { records, filter } } } = state$;
    let actionHistoryParams = { records_count: records, fetch_failed_action: true };

    // Check for user selected filters and apply them if they exist
    if(filter.smartContractName) {
      actionHistoryParams.account_name = filter.smartContractName;
    }

    let actionHistoryQuery = paramsToQuery(actionHistoryParams);
    // Get the action history list
    return apiPostgres(`get_actions${actionHistoryQuery}`).pipe(
      // Send it to the data reducer
      map(actionsListResponse => fetchFulfilled(actionsListResponse.response)),
      catchError(error => {
        errorLog("Push Action page / get action list error", error);
        return of(fetchRejected(error.response, { status: error.status }))
      })
    )
  }),
);

const fetchSmartContractsEpic = action$ => action$.pipe(
  ofType(FETCH_SMART_CONTRACTS),
  mergeMap(action => {
    // Get the list of smart contract to populate the Smart Contract Name dropdown
    return apiPostgres(`get_smart_contracts`).pipe(
      map(smartContractsResponse => {
        return fetchFulfilledSmartContract(smartContractsResponse.response)}),
      catchError(error => {
        errorLog("Push Action page/ get smart contracts error", error);
        return of(fetchRejectedSmartContract(error.response, { status: error.status }))
      })
    )
  })
);

const fetchAbiEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_ABI),
  mergeMap(action => {
    // Get the list of smart contract to populate the Smart Contract Name dropdown
    let { value: { pushactionPage: {  params  }}} = state$;
    return apiRpc("get_abi", params).pipe(
      map(res => fetchAbiFulfilled(res)),
      catchError(error => {
        errorLog("Push Action page/ get abi error",error);
        return of(fetchAbiRejected(error.response, { status: error.status }))
      })
    )
  })
);


const fetchActionDataEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_ACTION_DATA),
  mergeMap(action =>{    
    let params ={id_or_num: action.block_num};
    return apiRpc("get_block", params).pipe(
      map(res => fetchActionDataFulfilled(res, action.transaction_id, action.action_ordinal)),
      catchError(error => {
        errorLog("Push Action page/ get block details error",error);
        return of(fetchActionDataRejected(error.response, { status: error.status }))
      })
    )
  })
);

const actionPushFulfilledEpic = action$ => action$.pipe(
  delay(1000),
  ofType(ACTION_PUSH_FULFILLED),
  mapTo(fetchStart())
);

const actionPushRejectedEpic = action$ => action$.pipe(
  delay(1000),
  ofType(ACTION_PUSH_REJECTED),
  mapTo(fetchStart())
);

const recordsUpdateEpic = action$ => action$.pipe(
  ofType(RECORDS_UPDATE),
  mapTo(fetchStart()),
);

const filterUpdateEpic = action$ => action$.pipe(
  ofType(FILTER_UPDATE),
  mapTo(fetchStart()),
);

const actionPushEpic = action$ => action$.pipe(
  ofType(ACTION_PUSH),
  mergeMap(action => {
    let actionPayload = JSON.parse(action.actionToPush.payload);

    const query = {
      "actor": action.actionToPush.act.authorization.actor,
      "permission": action.actionToPush.act.authorization.permission,
      "action_name": action.actionToPush.act.name,
      "account_name": action.actionToPush.act.account,
      "payload": actionPayload
    };

    // Push the user created action to the RPC API
    return apiRpc("push_action", query).pipe(
      map(result => actionPushFulfilled(result)),
      catchError(error => of(actionPushRejected(error.json, { error: error.message })))
    )
  })
);


export const combinedEpic = combineEpics(
  fetchEpic,
  actionPushEpic,
  actionPushFulfilledEpic,
  actionPushRejectedEpic,
  fetchSmartContractsEpic,
  recordsUpdateEpic,
  filterUpdateEpic,
  fetchAbiEpic,
  fetchActionDataEpic
);

const getActionInitState = (defaultPermission) =>{
  return { _id: "",
            act: {
              account: "",
              name: "",
              authorization: defaultPermission || {
                actor: "",
                permission: ""
              }
            },
            payload: undefined,
            pushSuccess: false
          }
}
const dataInitState = {
  actionsList: [],
  error: undefined
}
const filterInitState = {
  smartContractName: ""
}

// Mapping function to map an action object retrieved from the API to our action object in the push action form
const mapPrefilledAction = (prefilledAction) => {
  if (!prefilledAction)
    return getActionInitState();
  return {
    _id: prefilledAction._id,
    act: {
      account: prefilledAction.act_account,
      name: prefilledAction.act_name,
      authorization : { 
        actor: prefilledAction.actor,
        permission: prefilledAction.permission
      }
    },
    payload: JSON.stringify("", null, 2)
  }
}

const mapActionPayload = (payload, transaction_id, action_ordinal, state) => {
  let transaction = payload.transactions.filter(eachTrx => eachTrx.trx.id.toUpperCase() === transaction_id);
  if(transaction.length > 0){
    return {
      ...state,
      payload: JSON.stringify(transaction[0].trx.transaction.actions[action_ordinal-1].data, null, 2)
    };    
  }else{
    return state;
  }
}


// Mapping function to update the action object with the user's input
const mapUpdatedAction = (updatedAction, defaultPermission) => {
  if (!updatedAction)
    return getActionInitState(defaultPermission);

  return {
    _id: updatedAction._id,
    act: {
      account: updatedAction.act.account,
      name: updatedAction.act.name,
      authorization: updatedAction.act.authorization,
    },
    payload: updatedAction.payload
  }
}

// Reducers

// Manages the action history list and the action object
const dataReducer = (state = dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
      return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        actionsList: action.actionsList,
        error: undefined
      };

    case FETCH_REJECTED:
      return {
        ...state,
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

// Handles loading state
const isFetchingActionHistoryReducer = (state = false, action) => {
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

// Handles loading state
const isPushingActionReducer = (state = false, action) => {
  switch (action.type) {
    case ACTION_PUSH:
      return true;

    case ACTION_PUSH_FULFILLED:
    case ACTION_PUSH_REJECTED:
      return false;

    default:
      return state;
  }
};

// Handles loading state
const isFetchingSmartContractReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_SMART_CONTRACTS:
      return true;

    case FETCH_SMART_CONTRACTS_FULFILLED:
    case FETCH_SMART_CONTRACTS_REJECTED:
      return false;

    default:
      return state;
  }
};

const isFetchingAbiReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_ABI:
      return true;

    case FETCH_ABI_FULFILLED:
    case FETCH_ABI_REJECTED:
      return false;

    default:
      return state;
  }
};

// Manages the action object
const actionReducer = (state = getActionInitState(), action) => {
  switch (action.type) {
    case ACTION_UPDATE:
      // User updates the action
      return mapUpdatedAction(action.updatedAction, action.defaultPermission);

    case ACTION_PREFILL:
      // Action is prefilled from the action history viewer
      return mapPrefilledAction(action.updatedAction);

    case FETCH_ACTION_DATA_FULFILLED:
      return mapActionPayload(action.payload, action.transaction_id, action.action_ordinal, state);

    case FETCH_ACTION_DATA_REJECTED:
      return state;

    case ACTION_PUSH:
      // User chooses to push the action
      return state;

    case ACTION_PUSH_FULFILLED:
      // Action push is successful
      return {
        ...getActionInitState(),
        error: undefined,
        pushSuccess: true
      };

    case ACTION_PUSH_REJECTED:
      // Action push fails
      return {
        ...state,
        error: action.error,
        pushSuccess: false
      };

    default:
      return state;
  }
};

// Manages the smart contracts list for the Smart Contract Name dropdown
const smartContractsReducer = (state = [], action) => {
  switch (action.type) {
    case FETCH_SMART_CONTRACTS_FULFILLED:
      return {
        ...state,
        smartContractsList: action.payload,
        error: undefined
      };

    default:
      return state;
  }
};


const abiReducer = (state = {}, action) => {
  switch (action.type) {
    case FETCH_ABI_FULFILLED:
      return {
        ...state,
        abiData: action.payload,
        error: undefined
      };

    default:
      return state;
  }
};

// Decides how many records to show in the action history viewer
const recordsReducer = (state = 100, action) => {
  switch (action.type) {
    case RECORDS_UPDATE:
      return action.recordsCount;

    default:
      return state;
  }
};

// Filters the results shown in the action history viewer
const filterReducer = (state = filterInitState, action) => {
  switch (action.type) {
    case FILTER_UPDATE:
      return action.filter;

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
  isFetchingActionHistory: isFetchingActionHistoryReducer,
  action: actionReducer,
  isPushingAction: isPushingActionReducer,
  smartContracts: smartContractsReducer,
  isFetchingSmartContract: isFetchingSmartContractReducer,
  records: recordsReducer,
  filter: filterReducer,
  params: paramsReducer,
  isFetchingAbiData: isFetchingAbiReducer,
  abi: abiReducer
  
})
