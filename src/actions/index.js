import {
  SIGNUP_REQUEST,
  CHECK_TOKEN_REQUEST,
  LOGOUT_REQUEST,
  SAVE_USERNAME_REQUEST,
  GET_PROFILE_REQUEST,
  SET_ERROR,
  CLEAR_ERROR,
  GET_DASHBOARD_REQUEST,
  POLL_DATA_REQUEST,
  SWITCH_GROUP
} from "../constants/service";

export function signupRequest(email, firstName, username) {
  return {
    type: SIGNUP_REQUEST,
    email,
    firstName,
    username
  };
}

export function checkToken() {
  return {
    type: CHECK_TOKEN_REQUEST
  };
}

export function saveUsername(username) {
  return {
    type: SAVE_USERNAME_REQUEST,
    username
  };
}

export function logout() {
  return {
    type: LOGOUT_REQUEST
  };
}

export function getUserProfile() {
  return {
    type: GET_PROFILE_REQUEST
  };
}

export function getDashboard(group = 24, update = false) {
  return {
    type: GET_DASHBOARD_REQUEST,
    group,
    update
  };
}

export function setError(error) {
  return {
    type: SET_ERROR,
    error
  };
}

export function clearError() {
  return {
    type: CLEAR_ERROR
  };
}

export function pollData() {
  return {
    type: POLL_DATA_REQUEST
  };
}

export function switchGroup() {
  return {
    type: SWITCH_GROUP
  };
}
