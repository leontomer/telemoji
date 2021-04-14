import {
  GET_CALL,
  ACCEPT_CALL,
  GET_CAMERA_STREAM,
  SET_CALLERS_STREAM,
  ANSWER_CALL,
  END_CALL
} from "./types";

import Peer from "simple-peer";
let peer;

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
    .getUserMedia({
      audio: true, video: {
        width: 640,
        height: 480
      }
    })
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

  peer = new Peer({
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
  peer = new Peer({
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

export const endCall = () => async (dispatch, getState) => {
  const userStream = getState().callReducer.userStream;
  if (userStream) {
    const tracks = userStream.getTracks();
    tracks.forEach(function (track) {
      track.stop();
    });
  }
  if (peer) {
    peer.destroy()
  }

  dispatch({
    type: END_CALL,
  });
}