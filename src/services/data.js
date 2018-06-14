import moment from "moment";
import Centrifuge from "centrifuge";
import { getToken } from "../services/token";

const API_ROOT = "https://api-test.buzzweb.com/";
const ENDPOINT_USER = "Users/";
const ENDPOINT_SIGNUP = "Users/i";
const ENDPOINT_TOKEN_STATUS = "Socials/instagram/profile_status?time_offset=";
const ENDPOINT_SAVE_USERNAME = "Socials/instagram/username";
const ENDPOINT_GET_DASHBOARD = "Socials/instagram/last_tracking_post?group=";
const ENDPOINT_WEBSOCKET_AUTH = "Websockets/connection_token";
const STATUS_OK = "OK";

const defaultHeaders = {
  "Content-Type": "application/json"
};
const authHeaders = () => ({
  ...defaultHeaders,
  "X-Auth-Token": getToken()
});

const okResult = payload => ({ ok: true, ...payload });
const errorResult = text => ({ error: text });
const logoutResult = () => ({ logout: true });

const request = (endpoint, method, headers, data, noCache) =>
  fetch(`${API_ROOT}${endpoint}`, {
    method,
    headers,
    cache: noCache ? "no-cache" : null,
    body: data ? JSON.stringify(data) : null
  }).catch(() => errorResult("Something bad happened (network error)"));

/** */
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

  const payload = await response.json();
  const { token, errors } = payload;

  if (errors) return errorResult(errors[0] || "Something bad happened");
  return okResult({ token });
}

/** */
export async function checkToken() {
  const timeOffset = moment().zone();
  const url = ENDPOINT_TOKEN_STATUS + timeOffset;
  const response = await request(url, "GET", authHeaders());

  if (response.status === 401) return logoutResult();

  const payload = await response.json();
  const { status, data } = payload;

  if (status !== STATUS_OK) return errorResult("Unknown error");
  return okResult({ ...data });
}

/** */
export async function saveUsername(username) {
  const response = await request(ENDPOINT_SAVE_USERNAME, "PUT", authHeaders(), {
    username
  });

  if (response.status === 401) return logoutResult();
  if (response.status === 404) return errorResult("The username not found");
  if (response.status === 409) return errorResult("The username is busy");

  const payload = await response.json();
  const { status, data } = payload;

  if (status !== STATUS_OK) return errorResult("Unknown error");
  return okResult({ ...data });
}

/** */
export async function getProfile() {
  const response = await request(ENDPOINT_USER, "GET", authHeaders());

  if (response.status === 401) return logoutResult();

  const payload = await response.json();
  return okResult(payload);
}

/** */
export async function getDashboard(group = 0) {
  const url = ENDPOINT_GET_DASHBOARD + group;
  const response = await request(url, "GET", authHeaders());

  if (response.status === 401) return logoutResult();
  if (response.status === 404) return errorResult("There is no data");

  const payload = await response.json();

  if (payload.data) return okResult(payload.data);
  return errorResult("Something bad happened");
}

/** */
export async function getWebsocketConnection() {
  const response = await request(ENDPOINT_WEBSOCKET_AUTH, "GET", authHeaders());

  if (response.status === 401) return logoutResult();

  const payload = await response.json();
  const { status, ...token } = payload;

  if (status === STATUS_OK) return okResult(token);
  return errorResult("Something bad happened");
}

/** */
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
