import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as blockchainInfoEpic, combinedReducer as blockchainInfoReducer} from './components/BlockchainInfo/BlockchainInfoReducer';

export const combinedEpic = combineEpics(
  blockchainInfoEpic,
);

export const combinedReducer = combineReducers({
  blockchainInfo: blockchainInfoReducer,
})
