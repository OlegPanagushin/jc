import { combineReducers } from "redux";
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
  LOGOUT_FAILURE,
  SET_ERROR,
  CLEAR_ERROR,
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE
} from "../constants/service";

const defaultState = {
  gettingToken: false,
  gotToken: false,
  checkingToken: false,
  tokenChecked: false,
  tokenCheckFail: false,
  savingUserName: false,
  userNameCheckFail: false,
  isAuthenticated: false,
  gettingProfile: false,
  gettingDashboard: false,
  error: null,
  user: {},
  post: {},
  stat: [],
  comments: []
};

const rootReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, error, userNameCheckFail, user, post, stat, comments } = action;
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
        gotToken: true,
        error: null
      };
    case SIGNUP_FAILURE:
      return {
        ...state,
        gettingToken: false,
        gotToken: false,
        error
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
        isAuthenticated: true,
        error: null
      };

    case CHECK_TOKEN_FAILURE:
      return {
        ...state,
        checkingToken: false,
        userNameCheckFail: userNameCheckFail === true,
        tokenChecked: true,
        tokenCheckFail: true,
        error
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
        isAuthenticated: true,
        error: null
      };

    case SAVE_USERNAME_FAILURE:
      return {
        ...state,
        savingUserName: false,
        specifyUsername: true,
        userNameCheckFail: true,
        isAuthenticated: false,
        error
      };

    case LOGOUT_REQUEST:
      return {
        ...state
      };
    case LOGOUT_SUCCESS:
      return {
        ...defaultState
      };

    case LOGOUT_FAILURE:
      return {
        ...state,
        error
      };

    case SET_ERROR:
      return {
        ...state,
        error
      };

    case CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case GET_PROFILE_REQUEST:
      return {
        ...state,
        gettingProfile: true
      };
    case GET_PROFILE_SUCCESS:
      return {
        ...state,
        user,
        gettingProfile: false
      };
    case GET_PROFILE_FAILURE:
      return {
        ...state,
        gettingProfile: false,
        error
      };

    case GET_DASHBOARD_REQUEST:
      return {
        ...state,
        gettingDashboard: true
      };
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        stat,
        post,
        comments,
        gettingDashboard: false
      };
    case GET_DASHBOARD_FAILURE:
      return {
        ...state,
        gettingDashboard: false,
        error
      };

    default:
      return state;
  }
};

export default combineReducers({
  rootReducer
});
