import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE
} from "../constants/service";

const defaultState = {
  expire: null,
  id: null,
  email: null,
  first_name: null,
  username: null,
  instagram_username: null,
  avatar: null,
  fetching: false
};

const userReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, user } = action;
  switch (type) {
    case GET_PROFILE_REQUEST:
      return {
        ...state,
        fetching: true
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...user,
        fetching: false
      };
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        fetching: false
      };

    default:
      return state;
  }
};

export default userReducer;
