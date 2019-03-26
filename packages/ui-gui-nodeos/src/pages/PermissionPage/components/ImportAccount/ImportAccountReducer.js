import { combineReducers } from 'redux';
import { interval, of, from } from 'rxjs';
import { mergeMap, mapTo, map, takeUntil, delay, catchError } from 'rxjs/operators';

import { combineEpics, ofType } from 'redux-observable';

const actionPrefix = `PermissionPage/ImportAccount/`;

const IMPORT_START = actionPrefix + `IMPORT_START`;
const IMPORT_FULFILLED = actionPrefix + `IMPORT_FULFILLED`;
const IMPORT_REJECTED = actionPrefix + `IMPORT_REJECTED`;

export const importStart = account => ({ type: IMPORT_START, account });
export const importFulfilled = payload => ({ type: IMPORT_FULFILLED, payload });
export const importRejected = ( payload, error ) => ({ type: IMPORT_REJECTED, payload, error });

const formSubmissionState = {
    isSubmitting: false,
    origState: {},
    error: undefined
};

const importEpic = ( action$, state$ ) => action$.pipe(
    ofType(IMPORT_START),
    mergeMap(action => {
      console.table(action.account);
      return from(new Promise(
          resolve => setTimeout(() => resolve(action.account), 2000)
        )).pipe(
          map(res => importFulfilled(res))
        )
    })
)

export const combinedEpic = combineEpics(
    importEpic
)

const importReducer = (state=formSubmissionState, action) => {
    switch (action.type) {
        case IMPORT_START:
          return {
            ...state,
            isSubmitting: true
          };
        case IMPORT_FULFILLED:
          return {
            ...state,
            origState: action.payload,
            isSubmitting: false
          };
        case IMPORT_REJECTED:
          return {
            ...state,
            origState: action.payload,
            submitError: action.error,
            isSubmitting: false
          };
        default:
          return state;
    }
}

export const combinedReducer = combineReducers({
    importKeys: importReducer
})