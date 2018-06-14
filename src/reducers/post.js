import { NEW_POST, UPDATE_POST } from "../constants/service";

const defaultState = {
  likes: 0,
  comments: 0,
  er: 0
};

const postReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, post } = action;

  switch (type) {
    case NEW_POST:
      return {
        ...state,
        post: { ...post }
      };

    case UPDATE_POST:
      return {
        ...state,
        post: {
          ...state.post,
          ...post
        }
      };

    default:
      return state;
  }
};

export default postReducer;
