import axios from "axios";
import {
    GET_FRIEND_LIST,
    SET_FRIEND_REQUESTS,
    SET_FRIEND_IN_FOCUS
} from "./types";
import { FriendProps } from "../reducers/authReducer";

const baseRoute = "/api/friends/";


export const sendFriendRequest = () => async (_, getState) => {
    const friendReuqestID = getState().friendReducer.friendInFocus._id;
    try {
        await axios.post(`${baseRoute}addfriend`, {
            friendReuqestID,
        });
    } catch (error) {
        console.error(error);
    }
};

export const removeFriend = ({
    userFriendId,
}: {
    userFriendId: string;
}) => async (dispatch) => {
    try {
        await axios.post(`${baseRoute}removeFriend`, {
            userFriendId,
        });
        dispatch(getFriendList())

    } catch (err) {
        console.log(err);
    }
};

export const updatePendingFriendRequests = () => async (dispatch, getState) => {
    try {
        const email = getState().authReducer.user.email
        const res = await axios.get(`${baseRoute}pendingFriendRequests`, {
            params: { email },
        });
        const friendRequests = res.data.user.friendRequests;
        dispatch({ type: SET_FRIEND_REQUESTS, payload: friendRequests });
    } catch (err) {
        console.log(err);
    }
};
export const approvePendingFriendRequest = ({
    userFriendEmail,
}: {
    userFriendEmail: string;
}) => async (dispatch) => {
    await axios.post(`${baseRoute}approveFriend`, {
        userFriendEmail,
    });
    dispatch(updatePendingFriendRequests())
    dispatch(getFriendList())
};

export const rejectPendingFriendRequest = ({
    userFriendEmail,
}: {
    userFriendEmail: string;
}) => async (dispatch) => {
    await axios.post(`${baseRoute}rejectFriend`, {
        userFriendEmail,
    });
    dispatch(updatePendingFriendRequests())
};


export const getFriendList = () => async (dispatch) => {
    try {
        const res = await axios.get(`${baseRoute}friendList`);
        const { data } = res;
        dispatch({ type: GET_FRIEND_LIST, payload: data.friendList });
    } catch (e) {
        console.warn(e);
    }
};

export const setFriendInFocus = (friend: FriendProps) => (dispatch) => {
    dispatch({
        type: SET_FRIEND_IN_FOCUS,
        payload: friend,
    });
};

export const friendListListener = () => async (dispatch, getState) => {
    const socket = getState().socketReducer.socket;

    socket.on("friendListUpdate", () => {
        dispatch(getFriendList());
    });
};

export const pendingFriendRequestsListener = () => async (dispatch, getState) => {
    const socket = getState().socketReducer.socket;

    socket.on("friendRequestListUpdate", () => {
        dispatch(updatePendingFriendRequests());
    });
}