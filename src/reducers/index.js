import { combineReducers } from "redux";
import auth from "./auth";
import post from "./post";
import charts from "./charts";
import comments from "./comments";
import user from "./user";
import posts from "./posts";
import {
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  SET_ERROR,
  CLEAR_ERROR,
  WS_ON,
  WS_OFF
} from "../constants/service";

const defaultState = {
  fetchingDashboard: false,
  updateDashboard: false,
  error: null,
  live: false
};

const root = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, update, error = null } = action;
  switch (type) {
    case GET_DASHBOARD_REQUEST:
      return {
        ...state,
        fetchingDashboard: update === true ? false : true,
        updateDashboard: true
      };
    case GET_DASHBOARD_SUCCESS:
    case GET_DASHBOARD_FAILURE:
      return { ...state, fetchingDashboard: false, updateDashboard: false };

    case SET_ERROR:
      return { ...state, error };

    case CLEAR_ERROR:
      return { ...state, error: null };

    case WS_ON:
      return { ...state, live: true };

    case WS_OFF:
      return { ...state, live: false };

    default:
      return state;
  }
};

export default combineReducers({
  auth,
  post,
  comments,
  charts,
  user,
  posts,
  root
});
