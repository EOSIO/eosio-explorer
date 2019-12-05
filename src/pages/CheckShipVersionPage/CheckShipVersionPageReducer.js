import { combineReducers } from 'redux';
import { combineEpics, ofType } from 'redux-observable';
import { mergeMap, map, catchError  } from 'rxjs/operators';
import { of } from 'rxjs';
import checkWs from "helpers/check-ws-conn"



const actionPrefix = `CheckShipVersionPage/`;
const CHECK_WEBSOCKET_CONN_START = actionPrefix + `CHECK_WEBSOCKET_CONN_START`;
const CHECK_WEBSOCKET_CONN_FULFILLED = actionPrefix + `CHECK_WEBSOCKET_CONN_SUCCESS`;
const CHECK_WEBSOCKET_CONN_REJECTED = actionPrefix + `CHECK_WEBSOCKET_CONN_ERROR`;

export const establishWebsocketConnectionStart = (host) => ({ type: CHECK_WEBSOCKET_CONN_START, host });
export const establishWebsocketConnectionFulfilled = (payload) => ({ type: CHECK_WEBSOCKET_CONN_FULFILLED, payload });
export const establishWebsocketConnectionRejected = (error) => ({ type: CHECK_WEBSOCKET_CONN_REJECTED, error });


const shipversionCheckEpic = (action$, state$) => action$.pipe(
  ofType(CHECK_WEBSOCKET_CONN_START),
  mergeMap(action => {

    let host = action.host;

    return checkWs(host).pipe(
      map(res => {
        console.log("Able to connect to ship plugin")
        return establishWebsocketConnectionFulfilled(res)}),
      catchError(err =>  {
        console.log("error connecting to ship plugin")
        return of(establishWebsocketConnectionRejected("error"))
      })
    )       
  })
);

//Reducer
const dataInitState = {
  payload: undefined,
  error: undefined
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case CHECK_WEBSOCKET_CONN_START:
        return dataInitState;

    case CHECK_WEBSOCKET_CONN_FULFILLED:
      return {
        ...state,
        payload: action.payload,
        error: undefined
      };
    case CHECK_WEBSOCKET_CONN_REJECTED:
      return {
        ...state,
        payload: undefined,
        error: action.error
      };
    default:
      return state;
  }
};

const isCheckingReducer = (state = false, action) => {
  switch (action.type) {
    case CHECK_WEBSOCKET_CONN_START:
      return true;

    case CHECK_WEBSOCKET_CONN_FULFILLED:
    case CHECK_WEBSOCKET_CONN_REJECTED:
      return false;

    default:
      return state;
  }
};

export const combinedEpic = combineEpics(
  shipversionCheckEpic
);

export const combinedReducer = combineReducers({
  data: dataReducer,
  isChecking: isCheckingReducer
});
