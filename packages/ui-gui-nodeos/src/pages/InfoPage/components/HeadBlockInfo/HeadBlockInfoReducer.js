import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';
import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, mapTo, map, concatMap, takeUntil, delay } from 'rxjs/operators';
import { ofType } from 'redux-observable';

//Action Type
const FETCH_HEADBLOCK = 'FETCH_HEADBLOCK';
const FETCH_HEADBLOCK_FULFILLED = 'FETCH_HEADBLOCK_FULFILLED';
const FETCH_HEADBLOCK_REJECTED = 'FETCH_HEADBLOCK_REJECTED';
const FETCH_HEADBLOCK_START_POLLING = 'FETCH_HEADBLOCK_START_POLLING';
const FETCH_HEADBLOCK_STOP_POLLING = 'FETCH_HEADBLOCK_STOP_POLLING';

//Action Creator
export const fetchHeadBlock = () => ({ type: FETCH_HEADBLOCK });
export const fetchHeadBlockFulfilled = payload => ({ type: FETCH_HEADBLOCK_FULFILLED, payload });
export const fetchHeadBlockRejected = payload => ({ type: FETCH_HEADBLOCK_REJECTED, payload });
export const fetchHeadBlockStartPolling = () => ({ type: FETCH_HEADBLOCK_START_POLLING });
export const fetchHeadBlockStopPolling = () => ({ type: FETCH_HEADBLOCK_STOP_POLLING });

//Action Dispatcher
export const dispatchFetchHeadBlockStartPolling = () => dispatch => dispatch(fetchHeadBlockStartPolling());
export const dispatchFetchHeadBlockStopPolling = () => dispatch => dispatch(fetchHeadBlockStopPolling());


//Epic
const headBlockInfoEpic1 = action$ => action$.pipe(
  ofType(FETCH_HEADBLOCK_START_POLLING),
  mapTo({ type: FETCH_HEADBLOCK }),
);

const headBlockInfoEpic2 = action$ => action$.pipe(
  ofType(FETCH_HEADBLOCK_START_POLLING),
  mergeMap(action =>
    interval(500).pipe(
      mergeMap(action =>
        ajax.getJSON(`/api/mongodb/get_block_latest`).pipe(
        map(response => fetchHeadBlockFulfilled(response))
      )),
      takeUntil(action$.pipe(
        ofType(FETCH_HEADBLOCK_STOP_POLLING)
      ))
    )
  ),
);

export const headBlockInfoEpic = combineEpics(
  headBlockInfoEpic1,
  headBlockInfoEpic2
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
