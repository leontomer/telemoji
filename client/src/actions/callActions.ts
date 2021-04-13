import {
  GET_CALL,
  ACCEPT_CALL,
  GET_CAMERA_STREAM,
  SET_CALLERS_STREAM,
  ANSWER_CALL
} from "./types";

import Peer from "simple-peer";

export const recieveCalls = () => async (dispatch, getState) => {
  const socket = getState().socketReducer.socket;

  socket.on("callInit", (data) => {
    dispatch({
      type: GET_CALL,
      payload: {
        callerSignal: data.signal,
        callerSocketId: data.to,
        receivingCall: true,
      },
    });
  });
};


export const getAnswerFromCall = () => async (dispatch, getState) => {
  const socket = getState().socketReducer.socket;

  socket.on("callAccepted", (signal) => {
    dispatch({
      type: ACCEPT_CALL,
      payload: { acceptCallSignal: signal },
    });
  });
};

export const getStreamFromVideoCamera = (id?: string) => (dispatch) => {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: true })
    .then((stream) => {
      dispatch({
        type: GET_CAMERA_STREAM,
        payload: { stream },
      });
      if (id) {
        dispatch(makeCall(id));
      } else {
        dispatch(acceptCall());
      }
    });
};

export const handleCallUser = (id: string) => (dispatch) => {
  dispatch(getStreamFromVideoCamera(id));
};
export const handleAcceptCall = () => (dispatch) => {
  dispatch(getStreamFromVideoCamera());
};

export const makeCall = (id: string) => async (dispatch, getState) => {
  const socket = getState().socketReducer.socket;
  const userStream = getState().callReducer.userStream;

  const peer = new Peer({
    initiator: true,
    trickle: false,
    config: {
      iceServers: [
        {
          urls: "turn:34.76.85.113:3478",
          username: "guest",
          credential: "somepassword",
        },
      ],
    },
    stream: userStream,
  });

  peer.on("signal", (data) => {
    socket.emit("callUser", {
      userToCall: id,
      signalData: data,
      fromUser: socket.id,
    });
  });

  peer.on("stream", (stream) => {
    dispatch({
      type: SET_CALLERS_STREAM,
      payload: { stream },
    });
  });

  socket.on("callAccepted", (signal) => {
    dispatch({
      type: ANSWER_CALL,
    });
    peer.signal(signal);
  });
};

export const acceptCall = () => async (dispatch, getState) => {
  const socket = getState().socketReducer.socket;
  const userStream = getState().callReducer.userStream;
  const callerSignal = getState().callReducer.callerSignal;
  const callerSocketId = getState().callReducer.callerSocketId;

  dispatch({
    type: ANSWER_CALL,
  });
  const peer = new Peer({
    initiator: false,
    trickle: false,
    stream: userStream,
  });
  peer.on("signal", (data) => {
    socket.emit("acceptCall", { signal: data, to: callerSocketId });
  });

  peer.on("stream", (stream) => {
    dispatch({
      type: SET_CALLERS_STREAM,
      payload: { stream },
    });
  });

  peer.signal(callerSignal);
};
