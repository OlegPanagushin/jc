import { takeLatest, call, put } from "redux-saga/effects";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  LOGOUT_REQUEST
} from "../constants/service";
import * as actions from "../actions";
import { getProfile, getDashboard } from "../services/data";

function* getProfileFlow() {
  const response = yield call(getProfile);
  const {
    serviseStatus,
    error = null,
    first_name,
    instagram_username
  } = response;

  switch (serviseStatus) {
    case GET_PROFILE_SUCCESS: //ok -> set isAuthorize
      yield put({
        type: GET_PROFILE_SUCCESS,
        user: {
          firstName: first_name,
          instagramUsername: instagram_username
        }
      });
      break;
    case LOGOUT_REQUEST: //error -> logout(delete token)
      yield put(actions.logout());
      yield put({
        type: GET_DASHBOARD_FAILURE,
        error: error
      });
      break;
    default:
      yield put({
        type: GET_PROFILE_FAILURE,
        error: error
      });
      break;
  }
}

function* getDasboardFlow(action) {
  const response = yield call(getDashboard, action.group);
  const { serviseStatus, error = null, ...data } = response;

  switch (serviseStatus) {
    case GET_DASHBOARD_SUCCESS: //ok -> set isAuthorize
      yield put({
        type: GET_DASHBOARD_SUCCESS,
        post: data.post,
        comments: data.comments,
        stat: data.stat
      });
      break;
    case LOGOUT_REQUEST: //error -> logout(delete token)
      yield put(actions.logout());
      yield put({
        type: GET_DASHBOARD_FAILURE,
        error: error
      });
      break;
    default:
      yield put({
        type: GET_DASHBOARD_FAILURE,
        error: error
      });
      break;
  }
}

function* authWatcher() {
  yield takeLatest(GET_PROFILE_REQUEST, getProfileFlow);
  yield takeLatest(GET_DASHBOARD_REQUEST, getDasboardFlow);
}

export default authWatcher;
