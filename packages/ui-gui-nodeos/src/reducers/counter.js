const initialState = {
  count: 0,
};

export const counterReducer = (state = initialState, action) => {
  switch(action.type) {
      case 'INCREASE_COUNTER':
          return {
              ...state,
              count: state.count + action.increment,
          };
      default:
          return state;
  }
};
