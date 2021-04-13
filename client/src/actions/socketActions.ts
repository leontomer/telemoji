import {
  CONNECT_TO_SOCKET,
  GET_SOCKET_USERS,
  LOGOUT_FROM_SOCKET,
} from "./types";
import io from "socket.io-client";

import axios from "axios";

const baseRoute = "/api/users/";
export const connectToSocket = () => async (dispatch) => {
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
};

export const loginUserToSocket = () => (_, getState) => {
  const socket = getState().socketReducer.socket;
  const _id = getState().authReducer.user._id;
  const firstName = getState().authReducer.user.firstName;

  socket.emit("login", { id: _id, firstName: firstName });
};

export const sendFriendRequest = (friendEmail) => (_, getState) => {
  const socket = getState().socketReducer.socket;
  const _id = getState().authReducer.user._id;

  socket.emit("sendFriendRequest", { id: _id, friendEmail });
};

export const logoutUserFromSocket = () => (dispatch, getState) => {
  const socket = getState().socketReducer.socket;
  socket.emit("logout");
  dispatch({
    type: LOGOUT_FROM_SOCKET,
  });
};

export const addFriend = ({
  userEmail,
  userFriendEmail,
}: {
  userEmail: string;
  userFriendEmail: string;
}) => async (dispatch, getState) => {
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
    console.error(error);
  }
};
