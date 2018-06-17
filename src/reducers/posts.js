import {
  GET_POSTS_REQUEST,
  GET_POSTS_SUCCESS,
  GET_POSTS_FAILURE
} from "../constants/service";

const defaultState = {
  fetching: false,
  posts: []
};

const postsReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, posts = [] } = action;

  switch (type) {
    case GET_POSTS_REQUEST:
      return {
        ...state,
        fetching: true
      };

    case GET_POSTS_SUCCESS:
      return {
        posts,
        fetching: false
      };

    case GET_POSTS_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
};

export default postsReducer;
