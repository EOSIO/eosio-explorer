import { combineReducers } from 'redux';

import HeadBlockInfoReducer from './components/HeadBlockInfo/HeadBlockInfoReducer';

export default combineReducers({
  headBlockInfo: HeadBlockInfoReducer,
})
