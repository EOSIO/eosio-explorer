import { combineReducers } from 'redux';
import { combineEpics } from 'redux-observable';

import { combinedEpic as permissionlistEpic, combinedReducer as permissionlistReducer } from './components/Permissionlist/PermissionlistReducer';

// IMPORTANT
// Must modify action prefix since action types must be unique in the whole app
const actionPrefix = `PermissionPage/`;

//Action Type
const PANEL_SELECT = actionPrefix + `PANEL_SELECT`;

//Action Creator
export const panelSelect = (panel) => ({ type: PANEL_SELECT, panel });

const panelReducer = (state="permission-list", action) => {
  switch (action.type) {
    case PANEL_SELECT:
        return action.panel;

    default:
      return state;
  }
};

export const combinedEpic = combineEpics(
  permissionlistEpic
);

export const combinedReducer = combineReducers({
  permissionlist: permissionlistReducer,
  panel: panelReducer,
})
