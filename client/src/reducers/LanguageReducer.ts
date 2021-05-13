import { SET_LANGUAGE } from "../actions/types";

import language from "../../Languages/Languages.json";

const initialState = {
  language: "En",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_LANGUAGE:
      return { language: payload };
    default:
      return state;
  }
}
