import createToast from './toastFactory';

const actionPrefix = `Toast/`;

const TOAST_ADD = actionPrefix + `TOAST_ADD`;
const TOAST_DISMISS = actionPrefix + `TOAST_DISMISS`;

export const toastAdd = options => ({ type: TOAST_ADD, payload: createToast(options) });
export const toastDismiss = id => ({ type: TOAST_DISMISS, id });

const toastReducer = (state = [], action) => {
    switch(action.type) {
        default:
            return state;
    }
}

export const combinedReducer = toastReducer;