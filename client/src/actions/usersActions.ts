import axios from "axios";
import {
  GET_FRIEND_LIST,
  SET_FRIEND_REQUESTS,
  SET_ABOUT,
  SET_IMAGE,
} from "./types";

const baseRoute = "/api/users/";

export const findUser = (email) => async (dispatch) => {
  try {
    const res = await axios.get(`${baseRoute}finduser`, {
      params: {
        email,
      },
    });

    return res.data.other;
  } catch (err) {
    console.log(err);
  }
};

export const addFriend = ({
  userEmail,
  userFriendEmail,
}: {
  userEmail: string;
  userFriendEmail: string;
}) => async (dispatch) => {
  try {
    const res = await axios.post(`${baseRoute}addfriend`, {
      userEmail,
      userFriendEmail,
    });
    const { data } = res;
    return res.data.other;
  } catch (err) {
    console.log(err);
  }
};

export const updatePendingFriendRequests = (email) => async (dispatch) => {
  try {
    const res = await axios.get(`${baseRoute}pendingFriendRequests`, {
      params: { email },
    });
    const friendRequests = res.data.user.friendRequests;
    dispatch({ type: SET_FRIEND_REQUESTS, payload: [...friendRequests] });
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

export const setAbout = ({
  id,
  about,
}: {
  id: string;
  about: string;
}) => async (dispatch) => {
  try {
    const res = await axios.post(`${baseRoute}about`, {
      id,
      about,
    });

    dispatch({ type: SET_ABOUT, payload: about });
  } catch (err) {
    console.log(err);
  }
};

export const setUserImageAction = ({
  id,
  imgAdrss,
}: {
  id: string;
  imgAdrss: string;
}) => async (dispatch) => {
  try {
    const res = await axios.post(`${baseRoute}image`, {
      id,
      imgAdrss,
    });

    dispatch({ type: SET_IMAGE, payload: imgAdrss });
  } catch (err) {
    console.log(err);
  }
};
