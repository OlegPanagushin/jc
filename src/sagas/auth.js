import { takeLatest, call, put } from "redux-saga/effects";
import { setToken, removeToken, getToken } from "../services/token";
import {
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  CHECK_TOKEN_REQUEST,
  CHECK_TOKEN_SUCCESS,
  CHECK_TOKEN_FAILURE,
  SAVE_USERNAME_REQUEST,
  SAVE_USERNAME_SUCCESS,
  SAVE_USERNAME_FAILURE,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS
} from "../constants/service";
import * as actions from "../actions";
import {
  signup,
  checkToken,
  saveUsername
  //   getProfile
} from "../services/data";

function* chekTokenFlow() {
  const token = getToken();

  if (!token) {
    //no token -> no user
    yield put({
      type: CHECK_TOKEN_FAILURE,
      error: null
    });
    return;
  }

  if (token) {
    const response = yield call(checkToken, token);
    const { serviseStatus, error = null } = response;

    switch (serviseStatus) {
      case SIGNUP_SUCCESS: //ok -> set isAuthorize
        yield put({
          type: CHECK_TOKEN_SUCCESS
        });
        break;
      case SAVE_USERNAME_REQUEST: //no username -> request user name
        yield put({
          type: CHECK_TOKEN_FAILURE,
          userNameCheckFail: true,
          error
        });
        break;
      case LOGOUT_REQUEST: //error -> logout(delete token)
      default:
        yield put({
          type: CHECK_TOKEN_FAILURE,
          error: error
        });
        yield put(actions.logout());
        break;
    }
  }
}

function* signupFlow(action) {
  const { email, firstName, username } = action;
  const response = yield call(signup, email, firstName);
  const { serviseStatus, token, error = null } = response;

  switch (serviseStatus) {
    case SAVE_USERNAME_REQUEST: //ok - got token
      yield put({
        type: SIGNUP_SUCCESS
      });
      yield call(setToken, token);
      yield put(actions.saveUsername(username));
      break;
    case SIGNUP_FAILURE: //error - show error and try one's more
    default:
      yield put({
        type: SIGNUP_FAILURE,
        error
      });
      break;
  }
}

function* saveUsernameFlow(action) {
  const { username } = action;
  const response = yield call(saveUsername, username);
  const { serviseStatus, error = null } = response;

  switch (serviseStatus) {
    case SAVE_USERNAME_SUCCESS:
      yield put({
        type: SAVE_USERNAME_SUCCESS
      });
      break;

    case SAVE_USERNAME_REQUEST:
      yield put({
        type: SAVE_USERNAME_FAILURE,
        error
      });
      break;

    case LOGOUT_REQUEST: // error -> delete token
    default:
      yield put({
        type: SAVE_USERNAME_FAILURE,
        error: error
      });
      yield put(actions.logout());
      break;
  }
}

function* logoutFlow() {
  yield call(removeToken);
  yield put({
    type: LOGOUT_SUCCESS
  });
}

function* authWatcher() {
  yield takeLatest(CHECK_TOKEN_REQUEST, chekTokenFlow);
  yield takeLatest(SIGNUP_REQUEST, signupFlow);
  yield takeLatest(SAVE_USERNAME_REQUEST, saveUsernameFlow);
  yield takeLatest(LOGOUT_REQUEST, logoutFlow);
}

export default authWatcher;
