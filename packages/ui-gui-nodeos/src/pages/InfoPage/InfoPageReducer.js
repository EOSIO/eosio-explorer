import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as headblockEpic, combinedReducer as headblockReducer} from './components/Headblock/HeadblockReducer';
import { combinedEpic as blockchainInfoEpic, combinedReducer as blockchainInfoReducer} from './components/BlockchainInfo/BlockchainInfoReducer';
import { combinedEpic as lastIrreversibleBlockEpic, combinedReducer as lastIrreversibleBlockReducer} from './components/LastIrreversibleBlockInfo/LastIrreversibleBlockInfoReducer';

export const combinedEpic = combineEpics(
  headblockEpic,
  blockchainInfoEpic,
  lastIrreversibleBlockEpic
);

export const combinedReducer = combineReducers({
  headblock: headblockReducer,
  blockchainInfo: blockchainInfoReducer,
  lastIrreversibleBlockInfo: lastIrreversibleBlockReducer
})
