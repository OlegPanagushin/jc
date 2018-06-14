import { NEW_CHARTS_DATA, UPDATE_CHARTS } from "../constants/service";

const defaultState = {
  likes: [],
  comments: []
};

const chartsReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, likes, comments } = action;

  switch (type) {
    case NEW_CHARTS_DATA:
      return {
        likes: [...likes],
        comments: [...comments]
      };

    case UPDATE_CHARTS:
      return {
        likes: [state.likes, ...likes],
        comments: [state.comments, ...comments]
      };

    default:
      return state;
  }
};

export default chartsReducer;
