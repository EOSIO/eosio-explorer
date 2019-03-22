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
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `permission/`;

//Action Type
const FETCH_START = actionPrefix + `FETCH_START`;
const FETCH_FULFILLED = actionPrefix + `FETCH_FULFILLED`;
const FETCH_REJECTED = actionPrefix + `FETCH_REJECTED`;
const DEFAULT_SET = actionPrefix + `DEFAULT_SET`;

//Action Creator
export const fetchStart = () => ({ type: FETCH_START });
export const fetchFulfilled = payload => ({ type: FETCH_FULFILLED, payload });
export const fetchRejected = ( payload, error ) => ({ type: FETCH_REJECTED, payload, error });
export const defaultSet = ( id ) => ({ type: DEFAULT_SET, id });

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

const composePermissionList = (originalList, payloadList) => {
  const len1 = originalList.length;
  let i = 0;
  let composedList = [];
  if (payloadList) {
    const len2 = payloadList.length;
    let j = 0;
    for (; i < len1; i++) {
      for (; j < len2; j++) {
        if (originalList[i]._id === payloadList[j]._id) {
          let origTime = originalList[i].createdAt;
          let privKey = originalList[i].private_key;
          if (!privKey || (origTime && origTime < payloadList[j].createdAt))
            composedList.push(payloadList[j]);
          else 
            composedList.push(originalList[i]);
          break;
        } 
      }
      composedList.push(originalList[i]);
    }
  } else if (!originalList && payloadList) {
    composedList = [...payloadList];
  }
  return composedList;
}

const dataReducer = (state=null, action) => {
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
})
