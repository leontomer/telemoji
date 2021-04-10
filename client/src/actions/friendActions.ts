import axios from "axios";
import {
    GET_FRIEND_LIST,
    SET_FRIEND_REQUESTS,
    SET_FRIEND_IN_FOCUS,
    UPDATE_FRIEND_REQUESTS
} from "./types";
import { FriendProps } from "../reducers/authReducer";

const baseRoute = "/api/friends/";


export const sendFriendRequest = () => async (_, getState) => {
    const friendReuqestID = getState().authReducer.friendInFocus._id;
    try {
        await axios.post(`${baseRoute}addfriend`, {
            friendReuqestID,
        });
    } catch (error) {
        console.error(error);
    }
};

export const removeFriend = ({
    userId,
    userFriendId,
}: {
    userId: string;
    userFriendId: string;
}) => async (dispatch) => {
    try {
        const res = await axios.post(`${baseRoute}removeFriend`, {
            userId,
            userFriendId,
        });
        const { data } = res;
        console.log({ data });
        return res.data.other;
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
export const approvePendingFriendRequest = async ({
    userEmail,
    userFriendEmail,
}: {
    userEmail: string;
    userFriendEmail: string;
}) => {
    const res = await axios.post(`${baseRoute}approveFriend`, {
        userEmail,
        userFriendEmail,
    });
    const { data } = res;
    console.log({ data });
    return res.data.other;
};

export const rejectPendingFriendRequest = async ({
    userEmail,
    userFriendEmail,
}: {
    userEmail: string;
    userFriendEmail: string;
}) => {
    const res = await axios.post(`${baseRoute}rejectFriend`, {
        userEmail,
        userFriendEmail,
    });
    const { data } = res;
    console.log({ data });
    return res.data.other;
};

export const getFriendList = (userEmail) => async (dispatch) => {
    try {
        const res = await axios.get(`${baseRoute}friendList`, {
            params: { email: userEmail },
        });
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

export const updateFriendRequests = () => async (dispatch, getState) => {
    const socket = getState().socketReducer.socket;

    socket.on("recieveFriendRequest", (data) => {
        dispatch({ type: UPDATE_FRIEND_REQUESTS, payload: data.requestFrom });
    });
};