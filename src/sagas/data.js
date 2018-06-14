import { take, put, call, takeLatest } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  POLL_DATA_REQUEST,
  POLL_DATA_SUCCESS,
  POLL_DATA_FAILURE,
  UPDATE_POST,
  UPDATE_COMMENTS,
  UPDATE_CHARTS
} from "../constants/service";
import * as actions from "../actions";
import {
  getProfile,
  getDashboard,
  getWebsocketConnection,
  createWebSocketConnection
} from "../services/data";

function* getProfileFlow() {
  const response = yield call(getProfile);
  const {
    ok,
    logout,
    first_name,
    instagram_username,
    error = "Unknown error"
  } = response;

  if (ok)
    yield put({
      type: GET_PROFILE_SUCCESS,
      user: {
        first_name,
        instagram_username
      }
    });
  else {
    yield put({ type: GET_PROFILE_FAILURE });
    yield put(actions.setError(error));
    if (logout) yield put(actions.logout());
  }
}

function* getDasboardFlow(action) {
  const response = yield call(getDashboard, action.group);
  const { ok, logout, error = "Unknown error", ...data } = response;

  if (ok) {
    const likesChartData = [];
    const commentsChartData = [];
    data.stat.forEach(sample => {
      likesChartData.push({
        likes: sample.likes_growth,
        when: sample.timestamp
      });
      commentsChartData.push({
        comments: sample.comments_growth,
        when: sample.timestamp
      });
    });
    yield put({
      type: GET_DASHBOARD_SUCCESS,
      post: data.post,
      commentsData: data.comments,
      likesChartData,
      commentsChartData
    });
  } else {
    yield put({ type: GET_DASHBOARD_FAILURE });
    yield put(actions.setError(error));
    if (logout) yield put(actions.logout());
  }
}

const START_WATCH = "START_WATCH";

function* pollDataFlow() {
  const response = yield call(getWebsocketConnection);
  const {
    ok,
    logout,
    error = "Unknown error",
    user_id,
    timestamp,
    token,
    private_channels
  } = response;

  if (ok) {
    yield put({
      type: POLL_DATA_SUCCESS,
      ws: {
        user_id,
        timestamp,
        token,
        channel: private_channels.instagram_channel
      }
    });
    yield put({
      type: START_WATCH,
      user_id,
      timestamp,
      token,
      channel: private_channels.instagram_channel
    });
  } else {
    yield put({ type: POLL_DATA_FAILURE });
    yield put(actions.setError(error));

    if (logout) yield put(actions.logout());
  }
}

function* authWatcher() {
  yield takeLatest(GET_PROFILE_REQUEST, getProfileFlow);
  yield takeLatest(GET_DASHBOARD_REQUEST, getDasboardFlow);
  yield takeLatest(POLL_DATA_REQUEST, pollDataFlow);
  yield takeLatest(START_WATCH, watchChannel);
}

function createSocketChannel(socket, channel) {
  return eventChannel(emit => {
    const sub = socket
      .subscribe(channel, emit)
      .on("subscribe", () => {
        //console.log("log from subscribe");
      })
      .on("unsubscribe", () => {
        //
      });

    return () => {
      sub.unsubscribe();
      socket.disconnect();
    };
  });
}

export function* watchChannel(action) {
  const { user_id, timestamp, token, channel } = action;

  if ((user_id, timestamp, token, channel)) {
    const socket = yield call(
      createWebSocketConnection,
      user_id,
      timestamp,
      token
    );
    const socketChannel = yield call(createSocketChannel, socket, channel);
    while (true) {
      const payload = yield take(socketChannel);
      const { event, data } = payload.data;
      switch (event) {
        case "update_post":
          yield put({
            type: UPDATE_POST,
            post: {
              comments: data.comments,
              likes: data.likes,
              er: data.er
            }
          });
          break;

        case UPDATE_COMMENTS:
          break;
        case UPDATE_CHARTS:
          break;
        default:
          break;
      }

      // //ok -> set isAuthorize
      // const likesChartData = [];
      // const commentsChartData = [];
      // data.stat.forEach(sample => {
      //   likesChartData.push({
      //     likes: sample.likes_growth,
      //     when: sample.timestamp
      //   });
      //   commentsChartData.push({
      //     comments: sample.comments_growth,
      //     when: sample.timestamp
      //   });
      // });
      // yield put({ type: INCOMING_PONG_PAYLOAD, payload });
    }
  }
}

export default authWatcher;
