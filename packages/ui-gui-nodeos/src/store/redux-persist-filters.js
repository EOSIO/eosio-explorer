//Ref: https://github.com/edy/redux-persist-transform-filter

import { createFilter } from 'redux-persist-transform-filter'

export default [
  createFilter(
    'blocklistPage',
    ['blocklist.filter']
  ),
]
