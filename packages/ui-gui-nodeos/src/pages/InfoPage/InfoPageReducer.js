import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as blockchainInfoEpic, combinedReducer as blockchainInfoReducer} from './components/BlockchainInfo/BlockchainInfoReducer';
import { combinedEpic as lastIrreversibleBlockEpic, combinedReducer as lastIrreversibleBlockReducer} from './components/LastIrreversibleBlockInfo/LastIrreversibleBlockInfoReducer';

export const combinedEpic = combineEpics(
  blockchainInfoEpic,
  lastIrreversibleBlockEpic
);

export const combinedReducer = combineReducers({
  blockchainInfo: blockchainInfoReducer,
  lastIrreversibleBlockInfo: lastIrreversibleBlockReducer
})
