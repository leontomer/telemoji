import { OPEN_DRAWER, CLOSE_DRAWER } from "../actions/types";

const initialState: {
  openDrawer: boolean;
} = { openDrawer: false };

export default function (state = initialState, action) {
  const { type } = action;

  switch (type) {
    case OPEN_DRAWER:
      return { ...state, openDrawer: true };

    case CLOSE_DRAWER:
      return { ...state, openDrawer: false };
    default:
      return state;
  }
}
