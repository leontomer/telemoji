import {
  GET_CALL,
  ACCEPT_CALL,
  GET_CAMERA_STREAM,
  SET_CALLERS_STREAM,
  ANSWER_CALL,
  END_CALL,
  CALLING_USER,
  SET_NOW_IN_CALL,
  SET_NOW_NOT_IN_CALL
} from "../actions/types";

const initialState = {
  language: {},
  callerSignal: null,
  receivingCall: null,
  callerSocketId: null,
  callerImage: null,
  callerName: null,
  callerId: null,
  currentlyInCall: false
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_CALL:
      return {
        ...state,
        callerSignal: payload.callerSignal,
        receivingCall: payload.receivingCall,
        callerSocketId: payload.callerSocketId,
        callerImage: payload.fromImageAddress,
        callerName: payload.callerName,
        callerId: payload.callerId,
      };
    case ACCEPT_CALL:
      return {
        ...state,
        acceptCallSignal: payload.acceptCallSignal,
      };

    case GET_CAMERA_STREAM:
      return {
        ...state,
        userStream: payload.stream,
      };
    case SET_CALLERS_STREAM:
      return {
        ...state,
        callersStream: payload.stream,
      };
    case ANSWER_CALL:
      return {
        ...state,
        callAccepted: true,
      };
    case END_CALL:
      return initialState;
    case CALLING_USER:
      return {
        ...state,
        callingUser: true,
      };
    case SET_NOW_IN_CALL:
      return {
        ...state,
        currentlyInCall: true
      }
    case SET_NOW_NOT_IN_CALL:
      return {
        ...state,
        currentlyInCall: false
      }
    default:
      return state;
  }
}
