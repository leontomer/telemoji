import {
  CONNECT_TO_SOCKET,
  GET_SOCKET_USERS,
  LOGOUT_FROM_SOCKET,
  SET_NOW_IN_CALL,
  SET_NOW_NOT_IN_CALL
} from "./types";
import io from "socket.io-client";
import { setMessage } from "./errorsActions";

import axios from "axios";
import { snackbarType } from "../Common/dataTypes";

const baseRoute = "/api/users/";
export const connectToSocket = () => async (dispatch) => {
  try {
    const socket = io.connect("/");
    let allConnectedUsers;
    socket.on("allUsers", async (users) => {
      allConnectedUsers = await users;
      dispatch({
        type: GET_SOCKET_USERS,
        payload: { allConnectedUsers },
      });
    });
    dispatch({
      type: CONNECT_TO_SOCKET,
      payload: { socket },
    });
    dispatch(loginUserToSocket());
  } catch (error) {
    dispatch(setMessage(error.name + ":" + error.message, snackbarType.error));
  }
};

export const loginUserToSocket = () => (dispatch, getState) => {
  try {
    const socket = getState().socketReducer.socket;
    const _id = getState().authReducer.user._id;
    const firstName = getState().authReducer.user.firstName;

    socket.emit("login", { id: _id, firstName: firstName });
    setInterval(() => {
      const inCall = getState().callReducer.currentlyInCall;
      socket.emit('ping', { id: _id, firstName: firstName, inCall: inCall })
    }, 15000)
    socket.on('ping', async (users) => {
      const allConnectedUsers = await users;
      dispatch({
        type: GET_SOCKET_USERS,
        payload: { allConnectedUsers },
      });
    })

  } catch (error) {
    dispatch(setMessage(error.name + ":" + error.message, snackbarType.error));
  }
};

export const sendFriendRequest = (friendEmail) => (dispatch, getState) => {
  try {
    const socket = getState().socketReducer.socket;
    const _id = getState().authReducer.user._id;

    socket.emit("sendFriendRequest", { id: _id, friendEmail });
  } catch (error) {
    dispatch(setMessage(error.name + ":" + error.message, snackbarType.error));
  }
};

export const logoutUserFromSocket = () => (dispatch, getState) => {
  try {
    const socket = getState().socketReducer.socket;
    socket.emit("logout");
    dispatch({
      type: LOGOUT_FROM_SOCKET,
    });
  } catch (error) {
    console.error("theeee error is", error);
    dispatch(
      setMessage(
        error.name + ":" + error.name + ":" + error.message,
        snackbarType.error
      )
    );
  }
};

export const addFriend =
  ({
    userEmail,
    userFriendEmail,
  }: {
    userEmail: string;
    userFriendEmail: string;
  }) =>
    async (dispatch, getState) => {
      try {
        const socket = getState().socketReducer.socket;
        const userId = getState().authReducer.user._id;
        const data = { userId, userFriendEmail };
        await axios.post(`${baseRoute}addfriend`, {
          userEmail,
          userFriendEmail,
        });
        socket.emit("addFriend", data);
      } catch (error) {
        dispatch(
          setMessage(error.name + ":" + error.message, snackbarType.error)
        );
      }
    };

export const endCallForMyCaller = (id) => (dispatch, getState) => {
  try {
    const callerSocketId = getState().callReducer.callerSocketId;
    const socket = getState().socketReducer.socket;
    socket.emit("endCallForUser", { id: id ? id : callerSocketId });
    dispatch({
      type: SET_NOW_NOT_IN_CALL
    })
  } catch (error) {
    dispatch(setMessage(error.name + ":" + error.message, snackbarType.error));
  }
};

export const logUserToOnCall = () => (dispatch, getState) => {
  try {
    const userId = getState().authReducer.user._id;
    const socket = getState().socketReducer.socket;
    socket.emit("userOnCall", { callerId: userId })
    dispatch({
      type: SET_NOW_IN_CALL
    })
  } catch (error) {
    dispatch(setMessage(error.name + ":" + error.message, snackbarType.error));
  }
}
