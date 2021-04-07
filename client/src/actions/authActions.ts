import axios from "axios";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
  LOGIN_SUCCESS_GOOGLE_FACEBOOK
} from "./types";
import { setError } from "./errorsActions";
import { snackbarType } from "../Common/dataTypes";
import setAuthToken from "../utilities/setAuthToken";
import { connectToSocket, logoutUserFromSocket } from './socketActions'

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
    dispatch(connectToSocket())
  } catch (err) {
    dispatch({ type: AUTH_ERROR });
  }
};

export const register = ({
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
}) => async (dispatch) => {
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
        dispatch(setError(error.msg, snackbarType.error))
      );
    }
    dispatch({ type: REGISTER_FAIL });
    throw err;
  }
};

export const login = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => async (dispatch) => {
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
      dispatch(setError(error.msg, snackbarType.error))
    );
    dispatch({ type: LOGIN_FAIL });
    throw err;
  }
};


export const loginGoogle = ({
  firstName,
  lastName,
  email
}: {
  firstName: string;
  lastName: string;
  email: string
}) => (dispatch) => {
  dispatch({
    type: LOGIN_SUCCESS_GOOGLE_FACEBOOK,
    payload: { firstName: firstName, lastName: lastName, email: email }

  });
}


export const logout = () => (dispatch) => {
  dispatch({ type: CLEAR_PROFILE });
  dispatch({ type: LOGOUT });
  dispatch(logoutUserFromSocket());
};
