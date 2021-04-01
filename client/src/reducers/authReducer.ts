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
  _id: string[];
}
interface InitialStateProps {
  isAuthenticated: boolean | null;
  token: string | null;
  loading: boolean;
  user: object | null;
  friendRequests: FriendProps[];
  friendList: FriendProps[];
}

export const initialState: InitialStateProps = {
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  loading: true,
  user: null,
  friendRequests: [],
  friendList: [],
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
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        friendRequests: [],
        friendList: [],
      };

    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload,
      };

    case SET_FRIEND_REQUESTS:
      return { ...state, friendRequests: payload };

    case GET_FRIEND_LIST:
      return { ...state, friendList: payload };
    default:
      return state;
  }
}
