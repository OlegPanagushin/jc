import { takeLatest, call, put } from "redux-saga/effects";
import { getToken } from "../services/token";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  LOGOUT_REQUEST
} from "../constants/service";
import * as actions from "../actions";
import { getProfile } from "../services/auth";

function* getProfileFlow() {
  const token = getToken();

  const response = yield call(getProfile, token);
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
    default:
      yield put({
        type: GET_PROFILE_FAILURE,
        error: error
      });
      yield put(actions.logout());
      break;
  }
}

function* authWatcher() {
  yield takeLatest(GET_PROFILE_REQUEST, getProfileFlow);
}

export default authWatcher;
