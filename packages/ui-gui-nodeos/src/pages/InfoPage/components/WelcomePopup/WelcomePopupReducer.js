import { combineReducers } from 'redux';

const actionPrefix = `InfoPage/WelcomePopup`;

const TOGGLE_SHOWAGAIN = actionPrefix + `TOGGLE_SHOWAGAIN`;

export const toggleShowAgain = isEnabled => ({ type: TOGGLE_SHOWAGAIN, isEnabled });

const welcomePopupReducer = (state = false, action) => {
  switch(action.type) {
    case TOGGLE_SHOWAGAIN:
      return action.isEnabled;
    
    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  showWelcomePopup: welcomePopupReducer 
});
