import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  LOGIN_SUCCESS_GOOGLE_FACEBOOK,
  SET_FRIEND_IN_FOCUS,
} from "./types";
import { setMessage } from "./errorsActions";
import { snackbarType } from "../Common/dataTypes";
import setAuthToken from "../utilities/setAuthToken";
import { connectToSocket, logoutUserFromSocket } from "./socketActions";

export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }
  try {
    const res = await axios.get("/api/auth");
    dispatch({
      type: USER_LOADED,
      payload: res.data,
    });
    dispatch(connectToSocket());
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register =
  ({
    firstName,
    email,
    password,
    lastName,
  }: {
    firstName: string;
    email: string;
    password: string;
    password2: string;
    lastName: string;
  }) =>
  async (dispatch) => {
    const body = { firstName, email, password, lastName };
    try {
      const res = await axios.post("/api/users/register", body);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        errors.forEach((error) =>
          dispatch(setMessage(error.msg, snackbarType.error))
        );
      }
      dispatch({ type: REGISTER_FAIL });
      throw err;
    }
  };

export const login =
  ({ email, password }: { email: string; password: string }) =>
  async (dispatch) => {
    const body = { email, password };
    try {
      const res = await axios.post("/api/auth/login", body);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      errors.forEach((error) =>
        dispatch(setMessage(error.msg, snackbarType.error))
      );
      dispatch({ type: LOGIN_FAIL });
      throw err;
    }
  };

export const forgotPassword = (email) => async (dispatch) => {
  try {
    console.log(email);
    const body = { email };
    const res = await axios.post("/api/auth/forgotPassword", body);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const changePassword = (token, password) => async (dispatch) => {
  try {
    const body = { password };
    setAuthToken(token);
    const res = await axios.post("/api/auth/changePassword", body);

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) =>
        dispatch(setMessage(error.msg, snackbarType.error))
      );
    }
  }
};

export const thirdPartyLogin =
  ({
    firstName,
    lastName,
    email,
  }: {
    firstName: string;
    lastName: string;
    email: string;
  }) =>
  async (dispatch) => {
    try {
      const res = await axios.post("/api/auth/thirdPartyLogin");
      dispatch({
        type: LOGIN_SUCCESS_GOOGLE_FACEBOOK,
        payload: { firstName: firstName, lastName: lastName, email: email },
      });
    } catch (error) {}
  };

export const loginWithGoogle = (tokenId) => async (dispatch) => {
  try {
    const body = { tokenId };
    const res = await axios.post("/api/auth/google", body);
    console.log("the res is", res.data);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });
    dispatch(loadUser());
  } catch (error) {
    throw error;
  }
};

export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
  dispatch({ type: SET_FRIEND_IN_FOCUS, payload: null });
  dispatch(logoutUserFromSocket());
};
