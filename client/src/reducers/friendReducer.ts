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
    UPDATE_FRIEND_REQUESTS

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
}

export const initialState: InitialStateProps = {
    friendRequests: [],
    friendList: [],
    friendInFocus: null,
};
export default function (state: InitialStateProps = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case SET_FRIEND_REQUESTS:
            return { ...state, friendRequests: payload };

        case UPDATE_FRIEND_REQUESTS:
            return { ...state, friendRequests: [...state.friendRequests, payload] };

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
