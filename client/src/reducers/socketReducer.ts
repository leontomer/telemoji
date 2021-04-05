import { CONNECT_TO_SOCKET, GET_SOCKET_USERS, LOGOUT_FROM_SOCKET } from "../actions/types";


const initialState = {
    socket: null,
    allConnectedUsers: []
}

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case CONNECT_TO_SOCKET:
            return {
                ...state,
                socket: payload.socket,
            };
        case GET_SOCKET_USERS:
            return {
                ...state,
                allConnectedUsers: payload.allConnectedUsers
            }

        case LOGOUT_FROM_SOCKET: {
            return {
                initialState
            }
        }
        default:
            return state;
    }
}
