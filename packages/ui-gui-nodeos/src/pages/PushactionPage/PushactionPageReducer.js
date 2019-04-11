/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, mapTo, map, catchError } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import apiRpc from 'services/api-rpc';
import { CONNECT_START } from 'reducers/endpoint';
import { errorLog } from 'helpers/error-logger';
import paramsToQuery from 'helpers/params-to-query';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `PushactionPage/Pushaction/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const ACTION_ID_SET = actionPrefix + `ACTION_ID_SET`;
const ACTION_UPDATE = actionPrefix + `ACTION_UPDATE`;
const ACTION_PREFILL = actionPrefix + `ACTION_PREFILL`;
const ACTION_PUSH = actionPrefix + `ACTION_PUSH`;
const ACTION_PUSH_FULFILLED = actionPrefix + `ACTION_PUSH_FULFILLED`;
const ACTION_PUSH_REJECTED = actionPrefix + `ACTION_PUSH_REJECTED`;
const FETCH_SMART_CONTRACTS = actionPrefix + `FETCH_SMART_CONTRACTS`;
const FETCH_SMART_CONTRACTS_FULFILLED = actionPrefix + `FETCH_SMART_CONTRACTS_FULFILLED`;
const FETCH_SMART_CONTRACTS_REJECTED = actionPrefix + `FETCH_SMART_CONTRACTS_REJECTED`;
const RECORDS_UPDATE = actionPrefix + `RECORDS_UPDATE`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = (actionsList) => ({ type: FETCH_FULFILLED, actionsList });
export const fetchRejected = (payload, error) => ({ type: FETCH_REJECTED, payload, error });
export const actionIdSet = (act_id) => ({ type: ACTION_ID_SET, actionId: act_id });
export const updateActionToPush = (updatedAction) => ({ type: ACTION_UPDATE, updatedAction });
export const prefillActionToPush = (updatedAction) => ({ type: ACTION_PREFILL, updatedAction });
export const actionPush = (action) => ({ type: ACTION_PUSH, actionToPush: action });
export const actionPushFulfilled = (response) => ({ type: ACTION_PUSH_FULFILLED, response });
export const actionPushRejected = (payload, error) => ({ type: ACTION_PUSH_REJECTED, payload, error });
export const fetchSmartContracts = () => ({ type: FETCH_SMART_CONTRACTS });
export const fetchFulfilledSmartContract = (payload, error) => ({ type: FETCH_SMART_CONTRACTS_FULFILLED, payload, error });
export const fetchRejectedSmartContract = (payload, error) => ({ type: FETCH_SMART_CONTRACTS_REJECTED, payload, error });
export const recordsUpdate = (count) => ({ type: RECORDS_UPDATE, recordsCount: count });

//Epic
const fetchEpic = (action$, state$) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action => {
    let { value: { pushactionPage: { actionId, records } } } = state$;
    let actionHistoryParams = { records_count: records };
    let getActionParams = { };

    // Check that we have block number and global sequence. Global sequence can be equal to 0 so we have to account for that here as well
    if(actionId.block_num && (actionId.global_sequence === 0 || actionId.global_sequence)) {
      getActionParams.block_num = actionId.block_num;
      getActionParams.global_sequence = actionId.global_sequence;
    }

    let actionHistoryQuery = paramsToQuery(actionHistoryParams);
    let getActionQuery = paramsToQuery(getActionParams);

    // If the actionId has been set by a user clicking "Prefill"
    if (getActionQuery) {
      // First, get the action history list
      return apiMongodb(`get_actions${actionHistoryQuery}`).pipe(
        mergeMap(actionsListResponse => {
          // And then, use the actionId to get the details of the selected action
          return apiMongodb(`get_action_details${getActionQuery}`)
            .pipe(
              mergeMap(actionResponse => [
                // Send them both to the data reducer
                fetchFulfilled(actionsListResponse.response),
                prefillActionToPush(actionResponse.response)
              ]),
              catchError(error => {
                errorLog(error);
                return of(
                  fetchFulfilled(actionsListResponse.response),
                  fetchRejected(error.response, { status: error.status })
                )
              })
            );
        }),
        catchError(error => {
          errorLog(error);
          return of(fetchRejected(error.response, { status: error.status }))
        })
      )
    } else {
      // If no actionId is present, just get the action history list
      return apiMongodb(`get_actions${actionHistoryQuery}`).pipe(
        // Send it to the data reducer
        map(actionsListResponse => fetchFulfilled(actionsListResponse.response)),
        catchError(error => {
          errorLog(error);
          return of(fetchRejected(error.response, { status: error.status }))
        })
      )
    }
  }),
);

const fetchSmartContractsEpic = action$ => action$.pipe(
  ofType(FETCH_SMART_CONTRACTS),
  mergeMap(action => {
    // Get the list of smart contract to populate the Smart Contract Name dropdown
    return apiMongodb(`get_smart_contracts`).pipe(
      map(smartContractsResponse => fetchFulfilledSmartContract(smartContractsResponse.response, null)),
      catchError(error => {
        errorLog(error);
        return of(fetchRejectedSmartContract(error.response, { status: error.status }))
      })
    )
  })
);

const actionIdSetEpic = action$ => action$.pipe(
  ofType(ACTION_ID_SET),
  mapTo(fetchStart()),
);

const endpointConnectEpic = action$ => action$.pipe(
  ofType(CONNECT_START),
  mapTo(fetchStart())
);

const actionPushFulfilledEpic = action$ => action$.pipe(
  ofType(ACTION_PUSH_FULFILLED),
  mapTo(actionIdSet(""), fetchStart())
);

const recordsUpdateEpic = action$ => action$.pipe(
  ofType(RECORDS_UPDATE),
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
    return from(apiRpc("push_action", query)).pipe(
      map(result => actionPushFulfilled(result)),
      catchError(error => of(actionPushRejected(error.json, { error: error.message })))
    )
  })
);


export const combinedEpic = combineEpics(
  fetchEpic,
  actionIdSetEpic,
  actionPushEpic,
  endpointConnectEpic,
  actionPushFulfilledEpic,
  fetchSmartContractsEpic,
  recordsUpdateEpic
);


const actionToPushInitState = {
  _id: "",
  act: {
    account: "",
    name: "",
    authorization: [{
      actor: "",
      permission: ""
    }]
  },
  payload: undefined,
  pushSuccess: false
}

const dataInitState = {
  actionsList: [],
  error: undefined
}

// Mapping function to map an action object retrieved from the API to our action object in the push action form
const mapPrefilledAction = (prefilledAction) => {
  if (!prefilledAction)
    return actionToPushInitState;

  let action = prefilledAction.find(x => x !== undefined);
  return {
    _id: action._id,
    act: {
      account: action.act.account,
      name: action.act.name,
      authorization: action.act.authorization.find(x => x !== undefined),
    },
    payload: JSON.stringify(action.act.data, null, 2)
  }
}

// Mapping function to update the action object with the user's input
const mapUpdatedAction = (updatedAction) => {
  if (!updatedAction)
    return actionToPushInitState;
  
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

//Reducers

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

// Manages the actionId, set when user clicks "Prefill" on an action in the action history viewer
const actionIdReducer = (state = "", action) => {
  switch (action.type) {
    case ACTION_ID_SET:
      return action.actionId;

    default:
      return state;
  }
};

// Manages the action object
const actionReducer = (state = actionToPushInitState, action) => {
  switch (action.type) {
    case ACTION_UPDATE:
      // User updates the action
      return mapUpdatedAction(action.updatedAction);

    case ACTION_PREFILL:
      // Action is prefilled from the action history viewer
      return mapPrefilledAction(action.updatedAction);

    case ACTION_PUSH:
      // User chooses to push the action
      return state;

    case ACTION_PUSH_FULFILLED:
      // Action push is successful
      return {
        ...actionToPushInitState,
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

// Decides how many records to show in the action history viewer
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
  actionId: actionIdReducer,
  action: actionReducer,
  isPushingAction: isPushingActionReducer,
  smartContracts: smartContractsReducer,
  isFetchingSmartContract: isFetchingSmartContractReducer,
  records: recordsReducer
})
