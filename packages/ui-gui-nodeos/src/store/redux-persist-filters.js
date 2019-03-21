//Ref: https://github.com/edy/redux-persist-transform-filter

import { createBlacklistFilter } from 'redux-persist-transform-filter'

export default [
  createBlacklistFilter(
    'permissionPage',
    ['panel']
  ),
]
