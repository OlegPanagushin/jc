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
import { signup, checkToken, saveUsername } from "../services/data";

const USERNAME_NOT_EXISTS = "not_exists";
const USERNAME_NOT_AVAILABLE = "not_available";
const USERNAME_EXISTS = "exists";
const USERNAME_PRIVATE = "private";

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
    const { ok, status, error } = response;

    //not_exists - не подключен пользователь instagram
    //exists - всё окей
    if (ok) {
      if (status === USERNAME_EXISTS) yield put({ type: CHECK_TOKEN_SUCCESS });
      else if (status === USERNAME_NOT_EXISTS)
        yield put({
          type: CHECK_TOKEN_FAILURE,
          userNameCheckFail: true,
          error: "Please specify username"
        });
    } else if (error)
      yield put({
        type: CHECK_TOKEN_FAILURE,
        userNameCheckFail: true,
        error
      });
    else {
      yield put({
        type: CHECK_TOKEN_FAILURE,
        error: error
      });
      yield put(actions.logout());
    }
  }
}

function* signupFlow(action) {
  const { email, firstName, username } = action;
  const response = yield call(signup, email, firstName);

  const { ok, token, error } = response;

  if (ok) {
    yield put({
      type: SIGNUP_SUCCESS
    });
    yield call(setToken, token);
    yield put(actions.saveUsername(username));
  } else
    yield put({
      type: SIGNUP_FAILURE,
      error
    });
}

function* saveUsernameFlow(action) {
  const { username } = action;
  const response = yield call(saveUsername, username);
  const { ok, logout, error, status } = response;

  //private - недоступный пользователь
  //not_available - нет такого аккаунта в инсте
  //exists - подключено
  if (ok) {
    switch (status) {
      case USERNAME_EXISTS:
        yield put({
          type: SAVE_USERNAME_SUCCESS
        });
        break;
      case USERNAME_PRIVATE:
        yield put({
          type: SAVE_USERNAME_FAILURE,
          error: `"${username} is private, try another"`
        });
        break;
      case USERNAME_NOT_AVAILABLE:
        break;

      default:
        yield put({
          type: SAVE_USERNAME_FAILURE,
          error: "Unknown error, try another username"
        });
        break;
    }
  } else if (logout) {
    yield put({
      type: SAVE_USERNAME_FAILURE,
      error
    });
    yield put(actions.logout());
  } else
    yield put({
      type: SAVE_USERNAME_FAILURE,
      error: error
    });
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
