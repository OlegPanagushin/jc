import Centrifuge from "centrifuge";
import {
  LOGOUT_REQUEST,
  SAVE_USERNAME_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SAVE_USERNAME_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  POLL_DATA_SUCCESS
} from "../constants/service";
import { getToken } from "../services/token";

const API_ROOT = "https://api-test.buzzweb.com/";
const ENDPOINT_USER = "Users/";
const ENDPOINT_SIGNUP = "Users/i";
const ENDPOINT_TOKEN_STATUS = "Socials/instagram/profile_status?time_offset=";
const ENDPOINT_SAVE_USERNAME = "Socials/instagram/username";
const ENDPOINT_GET_DASHBOARD = "Socials/instagram/last_tracking_post?group=";
const ENDPOINT_WEBSOCKET_AUTH = "Websockets/connection_token";

const defaultHeaders = {
  "Content-Type": "application/json"
};
const authHeaders = () => ({
  ...defaultHeaders,
  "X-Auth-Token": getToken()
});

const getResult = (status, data) => ({ serviseStatus: status, ...data });

const handleErrors = response => {
  if (response.status === 404)
    throw getResult(SAVE_USERNAME_REQUEST, {
      error: "Username not found"
    });

  if (response.status === 409)
    throw getResult(SIGNUP_FAILURE, {
      error: "Username is busy"
    });

  if (response.status === 401)
    throw getResult(LOGOUT_REQUEST, {
      error: "Authorization Required"
    });

  if (!response.ok)
    throw getResult(LOGOUT_REQUEST, {
      error: "Something bad happened"
    });

  return response;
};

const request = (endpoint, method, headers, data, noCache) =>
  fetch(`${API_ROOT}${endpoint}`, {
    method,
    headers,
    cache: noCache ? "no-cache" : null,
    body: data ? JSON.stringify(data) : null
  })
    .then(handleErrors)
    .catch(
      error =>
        error.serviseStatus
          ? error
          : getResult("Something bad happened (network error)")
    );

export async function signup(email, firstName) {
  const response = await request(
    ENDPOINT_SIGNUP,
    "POST",
    defaultHeaders,
    {
      email,
      first_name: firstName
    },
    true
  );
  if (response.serviseStatus) return response;

  const payload = await response.json();
  const { token, errors } = payload;
  if (errors)
    return getResult(SIGNUP_FAILURE, {
      error: errors[0] || "Something bad happened"
    });
  return getResult(SAVE_USERNAME_REQUEST, { token });
}

export async function checkToken() {
  const timeOffset = new Date().getTimezoneOffset();
  const url = ENDPOINT_TOKEN_STATUS + timeOffset;
  const response = await request(url, "GET", authHeaders());

  if (response.serviseStatus) return response;

  const payload = await response.json();
  const { status, username } = payload.data;
  if (status.toLowerCase() === "exists") {
    if (!username)
      return getResult(SAVE_USERNAME_REQUEST, {
        error: "User name is required"
      });
    else return getResult(SIGNUP_SUCCESS);
  }
  return getResult(LOGOUT_REQUEST, {
    error: "Authorization Required"
  });
}

export async function saveUsername(username) {
  const response = await request(ENDPOINT_SAVE_USERNAME, "PUT", authHeaders(), {
    username
  });

  if (response.serviseStatus) return response;

  const payload = await response.json();
  const { status } = payload.data;
  if (status.toLowerCase() !== "exists")
    return getResult(SAVE_USERNAME_REQUEST, {
      error: "Username is required"
    });
  return getResult(SAVE_USERNAME_SUCCESS);
}

export async function getProfile() {
  const response = await request(ENDPOINT_USER, "GET", authHeaders());

  if (response.serviseStatus) return response;

  const payload = await response.json();
  return getResult(GET_PROFILE_SUCCESS, payload);
}

export async function getDashboard(group = 0) {
  const url = ENDPOINT_GET_DASHBOARD + group;
  const response = await request(url, "GET", authHeaders());

  if (response.serviseStatus) return response;

  const payload = await response.json();

  if (payload.data) return getResult(GET_DASHBOARD_SUCCESS, payload.data);
  else
    return getResult(GET_DASHBOARD_FAILURE, {
      error: "Something bad happened"
    });
}

export async function getWebsocketConnection() {
  const response = await request(ENDPOINT_WEBSOCKET_AUTH, "GET", authHeaders());
  if (response.serviseStatus) return response;

  const payload = await response.json();
  return getResult(POLL_DATA_SUCCESS, payload);
}

export function createWebSocketConnection(user_id, timestamp, token) {
  const socket = new Centrifuge({
    url: "ws://92.53.127.48:8000/connection/websocket",
    user: user_id,
    timestamp: timestamp,
    token: token,
    authEndpoint: "https://api-test.buzzweb.com/Websockets/auth",
    authHeaders: authHeaders()
  });
  socket.connect();
  return socket;
}
