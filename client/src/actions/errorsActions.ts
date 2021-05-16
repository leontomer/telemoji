import uuid from "uuid";
import { SET_ALERT, CLEAR_ALERTS } from "./types";
import { snackbarType } from "../Common/dataTypes";

export const setMessage =
  (msg: string, alertType: snackbarType) => (dispatch) => {
    const id = uuid.v4();
    dispatch({
      type: SET_ALERT,
      payload: { msg, alertType, id },
    });
  };

export const clearErrors = () => (dispatch) => {
  dispatch({
    type: CLEAR_ALERTS,
  });
};
