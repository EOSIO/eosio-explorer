//Ref: https://github.com/edy/redux-persist-transform-filter

import storage from 'redux-persist/lib/storage';
import { createFilter } from 'redux-persist-transform-filter';

const reduxPersistFilters = [
  createFilter(
    'blocklistPage',
    ['blocklist.filter']
  ),
]

export default {
  key: 'root',
  storage,
  whitelist: ['blocklistPage', 'permission', 'endpoint'],
  transforms: [
    ...reduxPersistFilters
  ]
}
