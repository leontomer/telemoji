import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  ACCOUNT_DELETED,
  LOGIN_SUCCESS_GOOGLE_FACEBOOK,
  SET_FRIEND_REQUESTS,
  GET_FRIEND_LIST,
  SET_ABOUT,
  SET_IMAGE,
  SET_FRIEND_IN_FOCUS,
  REMOVE_FRIEND,
  UPDATE_FRIEND_REQUESTS,
} from "../actions/types";

export interface FriendProps {
  date: string;
  email: string;
  firstName: string;
  friendList: string[];
  friendRequests: string[];
  lastName: string[];
  password: string;
  about: string;
  imageAddress: string;
  available: boolean;
  __v: number;
  _id: string;
}
interface InitialStateProps {
  isAuthenticated: boolean | null;
  token: string | null;
  loading: boolean;
  user: object | null;
  friendRequests: FriendProps[];
  friendList: FriendProps[];
  friendInFocus: FriendProps | null;
  updateNeeded: {
    friendRequests: number;
  };
}

export const initialState: InitialStateProps = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: {
    firstName: "",
    lastName: "",
    email: "",
    friendList: [],
  },
  friendRequests: [],
  friendList: [],
  friendInFocus: null,
  updateNeeded: { friendRequests: 0 },
};
export default function (state: InitialStateProps = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      };

    case LOGIN_SUCCESS_GOOGLE_FACEBOOK:
      return {
        ...state,
        isAuthenticated: true,
        user: payload,
        loading: false,
      };

    case SET_ABOUT:
      // console.log({ ...state, user: { ...state.user, about: payload } });
      return {
        ...state,
        user: { ...state.user, about: payload },
      };

    case SET_IMAGE:
      return {
        ...state,
        user: { ...state.user, imageAddress: payload },
      };
    case REGISTER_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
    case LOGIN_FAIL:
    case ACCOUNT_DELETED:
      localStorage.removeItem("token");
      return initialState;

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    case SET_FRIEND_REQUESTS:
      return { ...state, friendRequests: payload };

    case UPDATE_FRIEND_REQUESTS:
      console.log("payload", payload);
      return {
        ...state,
        updateNeeded: {
          ...state.updateNeeded,
          friendRequests: payload,
        },
      };

    case GET_FRIEND_LIST:
      return { ...state, friendList: payload };

    case SET_FRIEND_IN_FOCUS:
      return { ...state, friendInFocus: payload };

    case REMOVE_FRIEND:
      return {
        ...state,
        friendList: payload,
      };

    default:
      return state;
  }
}
