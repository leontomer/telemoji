import { SET_ALERT, CLEAR_ALERTS } from "../actions/types";
import { errorType } from "../Common/dataTypes";

const initialState: errorType[] = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return [...state, payload];

    case CLEAR_ALERTS:
      return [];

    default:
      return state;
  }
}
