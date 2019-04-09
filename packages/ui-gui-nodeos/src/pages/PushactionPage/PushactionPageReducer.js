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

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = (actionsList, actionToPush) => ({ type: FETCH_FULFILLED, actionsList, actionToPush });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const actionIdSet = (act_id) => ({ type: ACTION_ID_SET, actionId: act_id });
export const updateActionToPush = (updatedAction) => ({ type: ACTION_UPDATE, updatedAction });
export const prefillActionToPush = (updatedAction) => ({ type: ACTION_PREFILL, updatedAction });
export const actionPush = (action) => ({ type: ACTION_PUSH, actionToPush: action });
export const actionPushFulfilled = (response) => ({ type: ACTION_PUSH_FULFILLED, response });
export const actionPushRejected = ( payload, error ) => ({ type: ACTION_PUSH_REJECTED, payload, error });
export const fetchSmartContracts = () => ({ type: FETCH_SMART_CONTRACTS });
export const fetchFulfilledSmartContract = (payload, error) => ({ type: FETCH_SMART_CONTRACTS_FULFILLED, payload, error });
export const fetchRejectedSmartContract = (payload, error) => ({type: FETCH_SMART_CONTRACTS_REJECTED, payload, error});

//Epic
const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action => {
    let { value: { pushactionPage: { actionId } } } = state$;
    let getActionQuery =  actionId !== undefined && actionId !== null && actionId !== "" ? "?action_id=" + actionId : "";

    if(getActionQuery) {
      return apiMongodb(`get_actions`).pipe(
        mergeMap(actionsListResponse => {
          return apiMongodb(`get_action_details${getActionQuery}`)
          .pipe(
            mergeMap(actionResponse => [
              fetchFulfilled(actionsListResponse.response, actionResponse.response),
              prefillActionToPush(actionResponse.response)
            ]),
            catchError(error => {
              errorLog(error);
              return of(fetchRejected(error.response, { status: error.status }))
            })
          );
        }),
        catchError(error => {
          errorLog(error);
          return of(fetchRejected(error.response, { status: error.status }))
        })
      )
    } else {
      return apiMongodb(`get_actions`).pipe(
        map(actionsListResponse => fetchFulfilled(actionsListResponse.response, null)),
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

// action pushed epic ACTION_PUSH_FULFILLED
const actionPushFulfilledEpic = action$ => action$.pipe(
  ofType(ACTION_PUSH_FULFILLED),
  mapTo(actionIdSet(""), fetchStart())
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
      "payload" : actionPayload
    };

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
  fetchSmartContractsEpic
);


//Reducer
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
  actionToPush: actionToPushInitState,
  error: undefined
}

const mapPrefilledAction = (prefilledAction) => {
  if(!prefilledAction)
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

const mapUpdatedAction = (updatedAction) => {
  if(!updatedAction)
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

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_START:
      return dataInitState;

    case FETCH_FULFILLED:
      return {
        ...state,
        actionsList: action.actionsList,
        actionToPush: mapPrefilledAction(action.actionToPush),
        error: undefined
      };

    case FETCH_REJECTED:
      return {
        ...state,
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

const actionIdReducer = (state = "", action) => {
  switch (action.type) {
    case ACTION_ID_SET:
      return action.actionId;

    default:
      return state;
  }
};

const actionReducer = (state = actionToPushInitState, action) => {
  switch(action.type) {
    case ACTION_UPDATE:
      return mapUpdatedAction(action.updatedAction);

    case ACTION_PREFILL:
      return mapPrefilledAction(action.updatedAction);

    case ACTION_PUSH:
      return state;

    case ACTION_PUSH_FULFILLED:
      return {
        ...actionToPushInitState,
        error: undefined,
        pushSuccess: true
      };

    case ACTION_PUSH_REJECTED:
      return {
        ...state,
        error: action.error,
        pushSuccess: false
      };

    default:
      return state;
  }
};

const smartContractsReducer = (state = [], action)  => {
  switch(action.type) {
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

export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer,
  actionId: actionIdReducer,
  action: actionReducer,
  isPushingAction: isPushingActionReducer,
  smartContracts: smartContractsReducer,
  isFetchingSmartContract: isFetchingSmartContractReducer
})
