import axios from "axios";

import { SET_ABOUT, SET_IMAGE, SET_DETAILS } from "./types";
import { setMessage } from "./errorsActions";
import { snackbarType } from "../Common/dataTypes";

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

export const setAbout =
  ({ id, about }: { id: string; about: string }) =>
  async (dispatch) => {
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

export const setUserImageAction =
  ({ imageAddress }: { imageAddress: string }) =>
  async (dispatch, getState) => {
    try {
      console.log(`from action imageAddress : ${imageAddress}`);
      const id = getState().authReducer.user.email;
      const res = await axios.post(`${baseRoute}image`, {
        id,
        imageAddress: imageAddress.toString(),
      });
      console.log("got here");
      dispatch({ type: SET_IMAGE, payload: imageAddress });
      console.log("and also got here");
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

export const editDetails =
  ({
    firstName,
    lastName,
    currentPassword,
    password,
  }: {
    firstName: string;
    lastName: string;
    currentPassword: string;
    password: string;
  }) =>
  async (dispatch) => {
    try {
      const res = await axios.post(`${baseRoute}editDetails`, {
        firstName,
        lastName,
        currentPassword,
        password,
      });
      dispatch({ type: SET_DETAILS, payload: { firstName, lastName } });
      if (res.data == "user edited successfully")
        dispatch(
          setMessage("details updated successfully", snackbarType.success)
        );
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) =>
          dispatch(setMessage(error.msg, snackbarType.error))
        );
      }
    }
  };
