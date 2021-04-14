import axios from "axios";

import {
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

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${baseRoute}allUsers`);
    return res.data.users;
  } catch (err) {
    console.warn(err);
  }
};

