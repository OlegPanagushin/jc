import { NEW_COMMENTS, UPDATE_COMMENTS } from "../constants/service";

const defaultState = [];

const commentsReducer = (state = defaultState, action) => {
  const { type, comments = [] } = action;

  switch (type) {
    case NEW_COMMENTS:
      return [...comments];

    case UPDATE_COMMENTS:
      return [...comments, ...state];

    default:
      return state;
  }
};

export default commentsReducer;
