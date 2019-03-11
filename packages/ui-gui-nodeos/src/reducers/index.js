import { combineReducers } from 'redux';

import { counterReducer } from './counter';
import InfoPageReducer from '../pages/InfoPage/InfoPageReducer';

export default combineReducers({
  counter: counterReducer,
  info: InfoPageReducer,
})
