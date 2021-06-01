import {
    SET_FACEAPI,
    SET_EMOTION_RECOGNITION_MODEL,
    SET_EMOTION,
    SET_BLAZEFACE
} from "../actions/types";

const initialState = {
    faceapi: null,
    selectedEmotion: '',
    emotionStats: null,
    blazeFace: null,
    emotionRecognition85p: null,
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_FACEAPI:
            return { ...state, faceapi: payload };

        case SET_BLAZEFACE:
            return { ...state, blazeFace: payload };

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
        default:
            return state;
    }
}
