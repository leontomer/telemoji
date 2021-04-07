import {
  CONNECT_TO_SOCKET,
  GET_SOCKET_USERS,
  LOGOUT_FROM_SOCKET,
} from "./types";
import io from "socket.io-client";

import axios from "axios";
import {
  GET_FRIEND_LIST,
  SET_FRIEND_REQUESTS,
  SET_ABOUT,
  SET_IMAGE,
  SET_FRIEND_IN_FOCUS,
} from "./types";

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
  // try {
  //   const res = await axios.post(`${baseRoute}addfriend`, {
  //     userEmail,
  //     userFriendEmail,
  //   });
  //   const { data } = res;
  //   console.log({ data });
  //   return res.data.other;
  // } catch (err) {
  //   console.log(err);
  // }
};

export const updatePendingFriendRequests = (email) => async (
  dispatch,
  getState
) => {
  try {
    const socket = getState().socketReducer.socket;

    socket.on("login", () => {
      console.log("login!!!!!!!!!!!!!!");
    });
    socket.on("friendRequestReceived", (data) => {
      const user = data.user;
      const friendRequests = data.user.friendRequests;
      dispatch({ type: SET_FRIEND_REQUESTS, payload: [...friendRequests] });
    });
  } catch (err) {
    console.log(err);
  }
};
