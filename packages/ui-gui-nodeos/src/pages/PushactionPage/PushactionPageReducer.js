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
import apiRpc from '@eos-toppings/api-rpc';

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

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = (actionsList, actionToPush) => ({ type: FETCH_FULFILLED, actionsList, actionToPush });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const pollingStart = () => ({ type: POLLING_START });
export const pollingStop = () => ({ type: POLLING_STOP });
export const smartContractNameSearch = (name) => ({ type: SMART_CONTRACT_NAME_UPDATE , smartContractName: name});
export const actionDigestSet = (act_digest) => ({ type: ACTION_DIGEST_SET, actionDigest: act_digest });

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
            map(actionResponse => fetchFulfilled(actionsListResponse.response, actionResponse.response)),
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


export const combinedEpic = combineEpics(
  startEpic,
  fetchEpic,
  smartContractNameToggleEpic,
  actionDigestSetEpic
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
  json: undefined
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
    json: action
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

export const combinedReducer = combineReducers({
  data: dataReducer,
  isFetching: isFetchingReducer,
  smartContractName: smartContractNameReducer,
  actionDigest: actionDigestReducer
})
