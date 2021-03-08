import { OPEN_DRAWER, CLOSE_DRAWER } from "./types";

export const openDrawer = () => (dispatch) => {
  dispatch({
    type: OPEN_DRAWER,
  });
};

export const closeDrawer = () => (dispatch) => {
  dispatch({
    type: CLOSE_DRAWER,
  });
};
