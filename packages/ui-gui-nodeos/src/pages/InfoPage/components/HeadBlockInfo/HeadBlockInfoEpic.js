import { interval } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { mergeMap, map, switchMap, takeUntil } from 'rxjs/operators';
import { ofType } from 'redux-observable';

const FETCH_HEADBLOCK = 'FETCH_HEADBLOCK';
const FETCH_HEADBLOCK_FULFILLED = 'FETCH_HEADBLOCK_FULFILLED';
const fetchHeadBlockFulfilled = payload => ({ type: FETCH_HEADBLOCK_FULFILLED, payload });

export const fetchHeadBlockEpic = action$ => action$.pipe(
  ofType('START_POLLING_FETCH_HEADBLOCK'),
  switchMap(action =>
    interval(500).pipe(
      mergeMap(action =>
        ajax.getJSON(`/api/mongodb/get_block_latest`).pipe(
        map(response => fetchHeadBlockFulfilled(response))
      )),
      takeUntil(action$.pipe(
        ofType('STOP_POLLING_FETCH_HEADBLOCK')
      ))
    )),

);
