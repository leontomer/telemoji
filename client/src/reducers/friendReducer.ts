import {
  SET_FRIEND_REQUESTS,
  GET_FRIEND_LIST,
  SET_FRIEND_IN_FOCUS,
  REMOVE_FRIEND,
  SET_CALL_HISTORY,
  SET_SELECTED_CALL_HISTORY_STATS,
  CLEAR_SELECTED_CALL_HISTORY_STATS
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
  friendRequests: FriendProps[];
  friendList: FriendProps[];
  friendInFocus: FriendProps | null;
  callHistory: Object[];
  selectedCallHistoryStats: Object | null;
}

export const initialState: InitialStateProps = {
  friendRequests: [],
  friendList: [],
  friendInFocus: null,
  callHistory: [],
  selectedCallHistoryStats: null
};
export default function (state: InitialStateProps = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_FRIEND_REQUESTS:
      return { ...state, friendRequests: payload };

    case GET_FRIEND_LIST:
      return { ...state, friendList: payload };

    case SET_FRIEND_IN_FOCUS:
      return { ...state, friendInFocus: payload };

    case REMOVE_FRIEND:
      return {
        ...state,
        friendList: payload,
      };
    case SET_CALL_HISTORY:
      return {
        ...state,
        callHistory: payload,
      };
    case SET_SELECTED_CALL_HISTORY_STATS:
      return {
        ...state,
        selectedCallHistoryStats: payload,
      }
    case CLEAR_SELECTED_CALL_HISTORY_STATS:
      return {
        ...state,
        selectedCallHistoryStats: null
      }

    default:
      return state;
  }
}
