import { SET_FACEAPI, SET_EMOTION_RECOGNITION_MODEL } from "../actions/types";

const initialState = {
    faceapi: null,
    emotionRecognition: null
};

export default function (state = initialState, action) {
    const { type, payload } = action;

    switch (type) {
        case SET_FACEAPI:
            return { ...state, faceapi: payload };

        case SET_EMOTION_RECOGNITION_MODEL:
            return { ...state, emotionRecognition: payload };

        default:
            return state;
    }
}
