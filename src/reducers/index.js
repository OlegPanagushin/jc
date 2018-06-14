import { combineReducers } from "redux";
import auth from "./auth";
import error from "./error";
import post from "./post";
import charts from "./charts";
import comments from "./comments";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  UPDATE_POST,
  UPDATE_COMMENTS,
  UPDATE_CHARTS
} from "../constants/service";

const defaultState = {
  gettingProfile: false,
  gettingDashboard: false,
  user: {},
  post: {},
  likesChartData: [],
  commentsChartData: [],
  commentsData: []
};

const rootReducer = (
  state = {
    ...defaultState
  },
  action
) => {
  const {
    type,
    user,
    post,
    likesChartData,
    commentsChartData,
    commentsData
  } = action;
  switch (type) {
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
        gettingProfile: false
      };

    case GET_DASHBOARD_REQUEST:
      return {
        ...state,
        gettingDashboard: true
      };
    case GET_DASHBOARD_SUCCESS:
      return {
        ...state,
        likesChartData,
        commentsChartData,
        post,
        commentsData,
        gettingDashboard: false
      };
    case GET_DASHBOARD_FAILURE:
      return {
        ...state,
        gettingDashboard: false
      };

    case UPDATE_POST:
      //const post = state;
      return {
        ...state,
        post: {
          ...state.post,
          ...post
        }
      };

    case UPDATE_COMMENTS:
      return state;

    case UPDATE_CHARTS:
      return state;

    default:
      return state;
  }
};

export default combineReducers({
  auth,
  error,
  post,
  comments,
  charts,
  rootReducer
});
