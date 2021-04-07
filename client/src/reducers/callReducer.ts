import { GET_CALL, ACCEPT_CALL } from "../actions/types";


const initialState = {
    callerSignal: null,
    acceptCallSignal: null,
    receivingCall: false,
    callerSocketId: ''
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case GET_CALL:
            return {
                ...state,
                callerSignal: payload.callerSignal,
                receivingCall: payload.receivingCall,
                callerSocketId: payload.callerSocketId
            };
        case ACCEPT_CALL:
            return {
                ...state,
                acceptCallSignal: payload.acceptCallSignal
            }
        default:
            return state;
    }
}
