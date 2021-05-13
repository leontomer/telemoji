import { SET_FACEAPI, SET_EMOTION_RECOGNITION_MODEL, SET_EMOTION } from "../actions/types";

const initialState = {
    faceapi: null,
    emotionRecognition80p: null,
    emotionRecognition85p: null,
    emotionRecognition87p: null,
    emotionRecognition95p: null,
    selectedEmotion: ''
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_FACEAPI:
            return { ...state, faceapi: payload };

        case SET_EMOTION_RECOGNITION_MODEL:
            return {
                ...state,
                emotionRecognition80p: payload.model80p,
                emotionRecognition85p: payload.model85p,
                emotionRecognition87p: payload.model87p,
                emotionRecognition95p: payload.model95p,
            };
        case SET_EMOTION:
            return {
                ...state,
                selectedEmotion: payload
            }
        default:
            return state;
    }
}
