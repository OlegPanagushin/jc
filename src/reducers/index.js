import { combineReducers } from "redux";
import auth from "./auth";
import post from "./post";
import charts from "./charts";
import comments from "./comments";
import user from "./user";
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
  gettingDashboard: false,
  error: null,
  live: false
};

const root = (
  state = {
    ...defaultState
  },
  action
) => {
  const { type, error = null } = action;
  switch (type) {
    case GET_DASHBOARD_REQUEST:
      return { ...state, gettingDashboard: true };
    case GET_DASHBOARD_SUCCESS:
    case GET_DASHBOARD_FAILURE:
      return { ...state, gettingDashboard: false };

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
  root
});
