import { SET_FACEAPI, SET_EMOTION_RECOGNITION_MODEL, SET_EMOTION, UPDATE_EMOT_STATS, CLEAR_EMOTIONS_STATS } from "../actions/types";

const initialState = {
    faceapi: null,
    emotionRecognition85p: null,
    selectedEmotion: '',
    emotionStats: null
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_FACEAPI:
            return { ...state, faceapi: payload };

        case SET_EMOTION_RECOGNITION_MODEL:
            return {
                ...state,
                emotionRecognition85p: payload.model85p,
            };
        case SET_EMOTION:
            return {
                ...state,
                selectedEmotion: payload
            }
        case UPDATE_EMOT_STATS:
            return {
                ...state,
                emotionStats: payload
            }
        case CLEAR_EMOTIONS_STATS:
            return {
                ...state,
                emotionStats: null
            }
        default:
            return state;
    }
}
