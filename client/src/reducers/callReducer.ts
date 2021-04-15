import { GET_CALL, ACCEPT_CALL, GET_CAMERA_STREAM, SET_CALLERS_STREAM, ANSWER_CALL, END_CALL } from "../actions/types";


const initialState = {
    callerSignal: null,
    acceptCallSignal: null,
    receivingCall: false,
    callAccepted: false,
    callerSocketId: '',
    userStream: null,
    callersStream: null,
    callerImage: '',
    callerName: ''
}

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
                callerName: payload.callerName
            };
        case ACCEPT_CALL:
            return {
                ...state,
                acceptCallSignal: payload.acceptCallSignal
            }

        case GET_CAMERA_STREAM:
            return {
                ...state,
                userStream: payload.stream
            }
        case SET_CALLERS_STREAM:
            return {
                ...state,
                callersStream: payload.stream
            }
        case ANSWER_CALL:
            return {
                ...state,
                callAccepted: true
            }
        case END_CALL:
            return initialState;
        default:
            return state;
    }
}
