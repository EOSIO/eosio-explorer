import { combineReducers } from 'redux';
import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { ofType } from 'redux-observable';

//Action Type
const FETCH_HEADBLOCK = 'FETCH_HEADBLOCK';
const FETCH_HEADBLOCK_FULFILLED = 'FETCH_HEADBLOCK_FULFILLED';
const FETCH_HEADBLOCK_REJECTED = 'FETCH_HEADBLOCK_REJECTED';

//Action Creator
export const fetchHeadBlock = () => ({ type: FETCH_HEADBLOCK });
export const fetchHeadBlockFulfilled = payload => ({ type: FETCH_HEADBLOCK_FULFILLED, payload });
export const fetchHeadBlockRejected = payload => ({ type: FETCH_HEADBLOCK_REJECTED, payload });

//Epic
export const headBlockInfoEpic = action$ => action$.pipe(
  ofType('START_POLLING_FETCH_HEADBLOCK'),
  switchMap(action =>
    interval(500).pipe(
      mergeMap(action =>
        ajax.getJSON(`/api/mongodb/get_block_latest`).pipe(
        map(response => fetchHeadBlockFulfilled(response))
      )),
      takeUntil(action$.pipe(
        ofType('STOP_POLLING_FETCH_HEADBLOCK')
      ))
    )),

);


//Reducer
const initialState = {
  payload: {},
  error: {}
}

const headBlockInfoDataReducer = (state=initialState, action) => {
    switch (action.type) {
      case FETCH_HEADBLOCK:
          return initialState;

      case FETCH_HEADBLOCK_FULFILLED:
        return {
          ...state,
          payload: action.payload
        };

      default:
        return state;
    }
  };

const isFetchingHeadBlockReducer = (state = false, action) => {
  switch (action.type) {
    case FETCH_HEADBLOCK:
      return true;

    case FETCH_HEADBLOCK_FULFILLED:
    case FETCH_HEADBLOCK_REJECTED:
      return false;

    default:
      return state;
  }
};

export const headBlockInfoReducer = combineReducers({
  headBlockInfoData: headBlockInfoDataReducer,
  isFetchingHeadBlock: isFetchingHeadBlockReducer
})
