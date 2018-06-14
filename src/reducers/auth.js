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
  gotToken: false,
  checkingToken: false,
  tokenChecked: false,
  tokenCheckFail: false,
  savingUserName: false,
  userNameCheckFail: false,
  isAuthenticated: false
};

const authReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, userNameCheckFail } = action;
  switch (type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        gettingToken: true,
        gotToken: false
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        gettingToken: false,
        gotToken: true
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        gettingToken: false,
        gotToken: false
      };

    case CHECK_TOKEN_REQUEST:
      return {
        ...state,
        checkingToken: true,
        tokenChecked: false,
        tokenCheckFail: false
      };
    case CHECK_TOKEN_SUCCESS:
      return {
        ...state,
        checkingToken: false,
        tokenChecked: true,
        tokenCheckFail: false,
        isAuthenticated: true
      };

    case CHECK_TOKEN_FAILURE:
      return {
        ...state,
        checkingToken: false,
        userNameCheckFail: userNameCheckFail === true,
        tokenChecked: true,
        tokenCheckFail: true
      };

    case SAVE_USERNAME_REQUEST:
      return {
        ...state,
        savingUserName: true,
        userNameCheckFail: false,
        isAuthenticated: false
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
