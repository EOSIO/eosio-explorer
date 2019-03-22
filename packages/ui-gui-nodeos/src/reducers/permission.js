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

    let { value: { blockdetailPage: { blockdetail: { params } }}} = state$;

    return from(new Promise(
        (resolve, reject) =>
          {
            resolve({ response:
              [
                {
                  id: '1234',
                  account: 'terry',
                  permission: 'owner',
                  public_key: '6666666',
                },
                {
                  id: '2345',
                  account: 'terry',
                  permission: 'active',
                  public_key: 'aaaaaaa',
                }
              ]
            })
          }
        )
      ).pipe(
      map(res => fetchFulfilled(res.response)),
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
      id: '1',
      account: 'eosio',
      permission: 'owner',
      public_key: '123456',
      private_key: '789'
    },
    {
      id: '2',
      account: 'eosio',
      permission: 'active',
      public_key: 'abcdef',
      private_key: 'zyx'
    },
  ],
  defaultId: "1"
}

const dataReducer = (state=dataInitState, action) => {
  switch (action.type) {
    case FETCH_FULFILLED:
    return {
      ...state,
      list: [...dataInitState.list, ...action.payload], // Todo: merge current list state with the list from payload
      // error: undefined
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
