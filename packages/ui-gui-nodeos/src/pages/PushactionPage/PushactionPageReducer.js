/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers, bindActionCreators } from 'redux';
import { of, from } from 'rxjs';
import { mergeMap, mapTo, map, catchError } from 'rxjs/operators';
import { combineEpics, ofType } from 'redux-observable';

import apiMongodb from 'services/api-mongodb';
import apiRpc from 'services/api-rpc';
import { CONNECT_START } from 'reducers/endpoint';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `PushactionPage/Pushaction/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const POLLING_START = actionPrefix + `POLLING_START`;
const POLLING_STOP = actionPrefix + `POLLING_STOP`;
const SMART_CONTRACT_NAME_UPDATE = actionPrefix + `SMART_CONTRACT_NAME_UPDATE`;
const ACTION_DIGEST_SET = actionPrefix + `ACTION_DIGEST_SET`;
const ACTION_UPDATE = actionPrefix + `ACTION_UPDATE`;
const ACTION_PREFILL = actionPrefix + `ACTION_PREFILL`;
const ACTION_PUSH = actionPrefix + `ACTION_PUSH`;
const ACTION_PUSH_FULFILLED = actionPrefix + `ACTION_PUSH_FULFILLED`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = (actionsList, actionToPush) => ({ type: FETCH_FULFILLED, actionsList, actionToPush });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });
export const smartContractNameSearch = (name) => ({ type: SMART_CONTRACT_NAME_UPDATE , smartContractName: name});
export const actionDigestSet = (act_digest) => ({ type: ACTION_DIGEST_SET, actionDigest: act_digest });
export const updateActionToPush = (updatedAction) => ({ type: ACTION_UPDATE, updatedAction });
export const prefillActionToPush = (updatedAction) => ({ type: ACTION_PREFILL, updatedAction });
export const actionPush = (action) => ({ type: ACTION_PUSH, actionToPush: action });
export const actionPushFulfilled = (response) => ({ type: ACTION_PUSH_FULFILLED, response });

//Epic
const startEpic = action$ => action$.pipe(
  ofType(POLLING_START),
  mapTo(fetchStart()),
);

const fetchEpic = ( action$, state$ ) => action$.pipe(
  ofType(FETCH_START),
  mergeMap(action => {
    let { value: {
      pushactionPage: { 
        data: {
            actionsList: { 
              smartContractName 
            }
          },
          actionDigest
        }
      } 
    } = state$;

    let searchString =  smartContractName ? 
                        "?account_name=" + smartContractName.toLowerCase() : 
                        "";

    let actionDigestQuery = actionDigest ? "?action_digest=" + actionDigest : "";

    if(actionDigestQuery) {
      return apiMongodb(`get_actions${searchString}`).pipe(
        mergeMap(actionsListResponse => {
          return apiMongodb(`get_action_details${actionDigestQuery}`)
          .pipe(
            mergeMap(actionResponse => [
              fetchFulfilled(actionsListResponse.response, actionResponse.response),
              prefillActionToPush(actionResponse.response)
            ]),
            catchError(error => of(fetchRejected(error.response, { status: error.status })))
          );
        }),
        catchError(error => of(fetchRejected(error.response, { status: error.status })))
      )
    } else {
      return apiMongodb(`get_actions${searchString}`).pipe(
        map(actionsListResponse => fetchFulfilled(actionsListResponse.response, null)),
        catchError(error => of(fetchRejected(error.response, { status: error.status })))
      )
    }


  }),
);

const smartContractNameToggleEpic = action$ => action$.pipe(
  ofType(SMART_CONTRACT_NAME_UPDATE),
  mapTo(pollingStart()),
);

const actionDigestSetEpic = action$ => action$.pipe(
  ofType(ACTION_DIGEST_SET),
  mapTo(pollingStart()),
);

const endpointConnectEpic = action$ => action$.pipe(
  ofType(CONNECT_START),
  mapTo(fetchStart())
);

const actionPushEpic = action$ => action$.pipe(
  ofType(ACTION_PUSH),
  mergeMap(action => {
    console.log("Got: " + JSON.stringify(action.actionToPush));
    const query = {
      "private_key": "5K7mtrinTFrVTduSxizUc5hjXJEtTjVTsqSHeBHes1Viep86FP5",
      "actor": action.actionToPush.act.authorization.actor,
      "permission": action.actionToPush.act.authorization.permission,
      "action_name": action.actionToPush.act.name,
      "account_name": action.actionToPush.act.account,
      "payload" : action.actionToPush.payload
    };
    console.log("Query: " + JSON.stringify(query))

    return from(apiRpc("push_action", query)).pipe(
      map(result => actionPushFulfilled(result)),
      catchError(error => of(fetchRejected(error.response, { status: error.status })))
    )
  })
);


export const combinedEpic = combineEpics(
  startEpic,
  fetchEpic,
  smartContractNameToggleEpic,
  actionDigestSetEpic,
  actionPushEpic,
  endpointConnectEpic
);


//Reducer
const actionToPushInitState = {
  _id: "",
  act: {
    account: "test",
    name: "",
    authorization: [{
      actor: "",
      permission: ""
    }]
  },
  payload: undefined
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
    payload: action.act.data
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
        actionsList: action.actionsList,
        actionToPush: action.actionToPush,
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

const smartContractNameReducer = (state = "", action) => {
  switch (action.type) {
    case SMART_CONTRACT_NAME_UPDATE:
      return action.smartContractName;

    default:
      return state;
  }
};

const actionDigestReducer = (state = "", action) => {
  switch (action.type) {
    case ACTION_DIGEST_SET:
      return action.actionDigest;

    default:
      return state;
  }
};

const actionReducer = (state = actionToPushInitState, action) => {
  switch(action.type) {
    case ACTION_UPDATE:
      console.log("Updating: " + JSON.stringify(action.updatedAction));
      return action.updatedAction;
      
    case ACTION_PREFILL:
      return mapPrefilledAction(action.updatedAction);

    case ACTION_PUSH:
      return state;

    case ACTION_PUSH_FULFILLED:
      console.log("Fulfilled: " + JSON.stringify(action.response));
      return state;

    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer,
  smartContractName: smartContractNameReducer,
  actionDigest: actionDigestReducer,
  action: actionReducer
})
