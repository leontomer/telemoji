import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import * as tf from "@tensorflow/tfjs";

import {
    SET_FACEAPI,
    SET_EMOTION_RECOGNITION_MODEL,
    SET_EMOTION,
    UPDATE_EMOT_STATS,
    SET_BLAZEFACE
} from "./types";
import axios from "axios";
const blazeface = require('@tensorflow-models/blazeface');

export const loadBlazeface = () => async (dispatch) => {
    try {
        const model = await blazeface.load();
        dispatch({
            type: SET_BLAZEFACE,
            payload: model,
        });
    } catch (error) {
        console.error(error)
    }
}
export const loadFaceapi = () => async (
    dispatch
) => {
    try {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            // faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            // faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        dispatch({
            type: SET_FACEAPI,
            payload: faceapi,
        });
    } catch (error) {
        console.error(error)
    }

};

export const setEmotion = (emotion) => async (
    dispatch
) => {
    dispatch({
        type: SET_EMOTION,
        payload: emotion,
    });
};

export const setCallEmotionStats = async (stats) => {
    if (stats) {
        axios.post(`/api/friends/call-stats`, { emotionStats: stats });
    }
}


export const loadEmotionRecognitionModel = () => async (dispatch) => {
    class L2 {

        static className = 'L2';

        constructor(config) {
            return tf.regularizers.l1l2(config)
        }
    }
    //@ts-ignore
    tf.serialization.registerClass(L2);

    try {
        const model85p = await tf.loadLayersModel(
            `${process.env.PUBLIC_URL}/85p/model.json`
        );
        dispatch({
            type: SET_EMOTION_RECOGNITION_MODEL,
            payload: {
                model85p,
            }
        });
    } catch (error) {
        console.log(error)
    }

};
