import { GET_CALL, ACCEPT_CALL } from "./types";

export const recieveCalls = () => async (dispatch, getState) => {
    const socket = getState().socketReducer.socket;

    socket.on("callInit", (data) => {
        console.log('the dataaaa isss', data);
        dispatch({
            type: GET_CALL,
            payload: { callerSignal: data.signal, callerSocketId: data.to, receivingCall: true },
        });
    });
};

export const getAnswerFromCall = () => async (dispatch, getState) => {
    const socket = getState().socketReducer.socket;

    socket.on("callAccepted", (signal) => {
        console.log('call accepted!!!')
        dispatch({
            type: ACCEPT_CALL,
            payload: { acceptCallSignal: signal },
        });
    });

}

