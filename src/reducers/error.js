import { SET_ERROR, CLEAR_ERROR } from "../constants/service";

const defaultState = {
  error: null
};

const errorReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, error } = action;
  switch (type) {
    case SET_ERROR:
      return { error };

    case CLEAR_ERROR:
      return { error: null };

    default:
      return state;
  }
};

export default errorReducer;
