import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SAVE_USERNAME_REQUEST,
  SAVE_USERNAME_SUCCESS,
  SAVE_USERNAME_FAILURE,
  CHECK_TOKEN_REQUEST,
  CHECK_TOKEN_SUCCESS,
  CHECK_TOKEN_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILURE
} from "../constants/service";

const defaultState = {
  gettingToken: false,
  checkingToken: false,
  savingUserName: false,
  userNameCheckFail: false,
  isAuthenticated: false,
  username: null
};

const authReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, userNameCheckFail, username } = action;
  switch (type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        gettingToken: true
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        gettingToken: false
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        gettingToken: false
      };

    case CHECK_TOKEN_REQUEST:
      return {
        ...state,
        checkingToken: true
      };
    case CHECK_TOKEN_SUCCESS:
      return {
        ...state,
        checkingToken: false,
        isAuthenticated: true
      };

    case CHECK_TOKEN_FAILURE:
      return {
        ...state,
        checkingToken: false,
        userNameCheckFail: userNameCheckFail === true
      };

    case SAVE_USERNAME_REQUEST:
      return {
        ...state,
        savingUserName: true,
        userNameCheckFail: false,
        isAuthenticated: false,
        username: username
      };
    case SAVE_USERNAME_SUCCESS:
      return {
        ...state,
        savingUserName: false,
        specifyUsername: true,
        userNameCheckFail: false,
        isAuthenticated: true
      };

    case SAVE_USERNAME_FAILURE:
      return {
        ...state,
        savingUserName: false,
        specifyUsername: true,
        userNameCheckFail: true,
        isAuthenticated: false
      };

    case LOGOUT_SUCCESS:
      return {
        ...defaultState
      };

    case LOGOUT_REQUEST:
    case LOGOUT_FAILURE:
    default:
      return state;
  }
};

export default authReducer;
