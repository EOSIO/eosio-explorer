import { combineReducers } from 'redux';

const FETCH_HEADBLOCK = 'FETCH_HEADBLOCK';
const FETCH_HEADBLOCK_FULFILLED = 'FETCH_HEADBLOCK_FULFILLED';
const FETCH_HEADBLOCK_REJECTED = 'FETCH_HEADBLOCK_REJECTED';

export const fetchHeadBlock = () => ({ type: FETCH_HEADBLOCK });
export const fetchHeadBlockFulfilled = payload => ({ type: FETCH_HEADBLOCK_FULFILLED, payload });
export const fetchHeadBlockRejected = payload => ({ type: FETCH_HEADBLOCK_REJECTED, payload });

// Info Reducer

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

export default combineReducers({
  headBlockInfoData: headBlockInfoDataReducer,
  isFetchingHeadBlock: isFetchingHeadBlockReducer
})
