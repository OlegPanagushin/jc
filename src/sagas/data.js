import { take, put, call, takeLatest } from "redux-saga/effects";
import { eventChannel } from "redux-saga";
import {
  GET_PROFILE_REQUEST,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_FAILURE,
  GET_DASHBOARD_REQUEST,
  GET_DASHBOARD_SUCCESS,
  GET_DASHBOARD_FAILURE,
  LOGOUT_REQUEST,
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
    case GET_DASHBOARD_SUCCESS:
      {
        //ok -> set isAuthorize
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
      }
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

const START_WATCH = "START_WATCH";

function* pollDataFlow() {
  const response = yield call(getWebsocketConnection);
  const {
    serviseStatus,
    error = null,
    user_id,
    timestamp,
    token,
    private_channels
  } = response;
  switch (serviseStatus) {
    case POLL_DATA_SUCCESS:
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
      break;
    case LOGOUT_REQUEST: //error -> logout(delete token)
      yield put(actions.logout());
      yield put({
        type: POLL_DATA_FAILURE,
        error: error
      });
      break;
    default:
      yield put({
        type: POLL_DATA_FAILURE,
        error: error
      });
      break;
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
