import { combineReducers } from 'redux';

const actionPrefix = `InfoPage/WelcomePopup`;

const TOGGLE_SHOWAGAIN = actionPrefix + `TOGGLE_SHOWAGAIN`;
const TOGGLE_SESSIONSHOWAGAIN = actionPrefix + `TOGGLE_SESSIONSHOWAGAIN`;

export const toggleShowAgain = isEnabled => ({ type: TOGGLE_SHOWAGAIN, isEnabled });
export const toggleSessionShowAgain = isEnabled => ({ type: TOGGLE_SESSIONSHOWAGAIN, isEnabled });

const welcomePopupReducer = (state = false, action) => {
  switch(action.type) {
    case TOGGLE_SHOWAGAIN:
      return action.isEnabled;
    
    default:
      return state;
  }
};

const sessionWelcomePopupReducer = (state = true, action) => {
  switch(action.type) {
    case TOGGLE_SHOWAGAIN:
      return action.isEnabled;
    
    default:
      return state;
  }
};

export const combinedReducer = combineReducers({
  showWelcomePopup: welcomePopupReducer,
  sessionShowWelcomePopup: sessionWelcomePopupReducer 
});
