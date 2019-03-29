/*
  Syntax and Convention Reference:
  https://github.com/erikras/ducks-modular-redux
  http://blog.jakoblind.no/reduce-redux-boilerplate/
*/

import { combineReducers } from 'redux';
import { of } from 'rxjs';
import { mergeMap, throttleTime } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';
import { FETCH_FULFILLED as HEADBLOCK_FETCH_FULFILLED } from 'reducers/headblock';
import { FETCH_FULFILLED as LASTBLOCKINFO_FETCH_FULFILLED } from 'reducers/lastblockinfo';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `Header/ConnectionIndicator/`;

//Action Type
const LAST_STORE = actionPrefix + `LAST_STORE`;

//Action Creator
export const lastStore = (curr) => ({ type: LAST_STORE, curr });
//Epic
const pollingEpic = ( action$, state$ ) => action$.pipe(
  ofType(HEADBLOCK_FETCH_FULFILLED, LASTBLOCKINFO_FETCH_FULFILLED),
  throttleTime(2000),
  // mapTo(lastStore())
  mergeMap(action => {

      let { value } = state$;
      let { headblock:
        { data: headblockData },
        lastblockinfo:
        { data: lastblockinfoData },
        connectionIndicator: {
          last
        }
      } = value;

      let { payload : [{block_num: headblockNum }={}]= [] } = headblockData;
      let { payload : {head_block_num: lastblockinfoNum }= {} } = lastblockinfoData;

      return of(lastStore({headblockNum, lastblockinfoNum}))
    }),
);



export const combinedEpic = combineEpics(
  pollingEpic
);

//ENUM
export const STATUS_NORMAL = "STATUS_NORMAL";
export const STATUS_STOPPED = "STATUS_STOPPED";

//Reducer
const initState = {
  last:{
    headblockNum: 0,
    lastblockinfoNum: 0
  },
  status:{
    headblockStatus: STATUS_STOPPED,
    lastblockinfoStatus: STATUS_STOPPED
  }
}

const reducer = (state=initState, action) => {
  switch (action.type) {
    case LAST_STORE:
      let status = {}
      status.headblockStatus = STATUS_NORMAL;
      if ( typeof action.curr.headblockNum === "undefined" || action.curr.headblockNum === state.last.headblockNum){
        status.headblockStatus = STATUS_STOPPED;
      }

      status.lastblockinfoStatus = STATUS_NORMAL;
      if ( typeof action.curr.lastblockinfoNum === "undefined" || action.curr.lastblockinfoNum === state.last.lastblockinfoNum){
        status.lastblockinfoStatus = STATUS_STOPPED;
      }
      return {
        ...state,
        last: {...action.curr},
        status
      };
    default:
      return state;
  }
};


export const combinedReducer = reducer;
