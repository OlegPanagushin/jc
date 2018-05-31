import {
  LOGOUT_REQUEST,
  SAVE_USERNAME_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SAVE_USERNAME_SUCCESS,
  GET_PROFILE_SUCCESS
} from "../constants/service";

const API_ROOT = "https://api-test.buzzweb.com/";
const ENDPOINT_USER = "Users/";
const ENDPOINT_SIGNUP = "Users/i";
const ENDPOINT_TOKEN_STATUS = "Socials/instagram/profile_status?time_offset=";
const ENDPOINT_SAVE_USERNAME = "Socials/instagram/username";

const defaultHeaders = {
  "Content-Type": "application/json"
};
const headersWithToken = token => ({
  ...defaultHeaders,
  "X-Auth-Token": token
});

const getServiceResult = (status, data) => ({ serviseStatus: status, ...data });

const handleErrors = response => {
  if (response.status === 404)
    throw getServiceResult(SAVE_USERNAME_REQUEST, {
      error: "Username not found"
    });

  if (response.status === 409)
    throw getServiceResult(SAVE_USERNAME_REQUEST, {
      error: "Username is busy"
    });

  if (response.status === 401)
    throw getServiceResult(LOGOUT_REQUEST, {
      error: "Authorization Required"
    });

  if (!response.ok)
    throw getServiceResult(LOGOUT_REQUEST, {
      error: "Something bad happened"
    });

  return response;
};

const createRequest = (endpoint, method, headers, data, noCache) =>
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
          : getServiceResult("Something bad happened (network error)")
    );

export async function signup(email, firstName) {
  const response = await createRequest(
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
    return getServiceResult(SIGNUP_FAILURE, {
      error: errors[0] || "Something bad happened"
    });
  return getServiceResult(SAVE_USERNAME_REQUEST, { token });
}

export async function checkToken(token) {
  const timeOffset = new Date().getTimezoneOffset();
  const url = ENDPOINT_TOKEN_STATUS + timeOffset;
  const response = await createRequest(url, "GET", headersWithToken(token));

  if (response.serviseStatus) return response;

  const payload = await response.json();
  const { status, username } = payload.data;
  if (status.toLowerCase() === "exists") {
    if (!username)
      return getServiceResult(SAVE_USERNAME_REQUEST, {
        error: "User name is required"
      });
    else return getServiceResult(SIGNUP_SUCCESS);
  }
  return getServiceResult(LOGOUT_REQUEST, {
    error: "Authorization Required"
  });
}

export async function saveUsername(token, username) {
  const response = await createRequest(
    ENDPOINT_SAVE_USERNAME,
    "PUT",
    headersWithToken(token),
    {
      username
    }
  );

  if (response.serviseStatus) return response;

  const payload = await response.json();
  const { status } = payload.data;
  if (status.toLowerCase() !== "exists")
    return getServiceResult(SAVE_USERNAME_REQUEST, {
      error: "Username is required"
    });
  return getServiceResult(SAVE_USERNAME_SUCCESS);
}

export async function getProfile(token) {
  const response = await createRequest(
    ENDPOINT_USER,
    "GET",
    headersWithToken(token)
  );

  if (response.serviseStatus) return response;

  const payload = await response.json();
  return getServiceResult(GET_PROFILE_SUCCESS, payload);
}
