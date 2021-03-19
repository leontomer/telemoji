import uuid from "uuid";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import * as tf from "@tensorflow/tfjs";

import { SET_FACEAPI, SET_EMOTION_RECOGNITION_MODEL } from "./types";

export const loadFaceapi = () => async (
    dispatch
) => {
    try {
        const MODEL_URL = "/models";
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        dispatch({
            type: SET_FACEAPI,
            payload: faceapi,
        });
    } catch (error) {
        console.error(error)
    }

};

export const loadEmotionRecognitionModel = () => async (dispatch) => {
    try {
        const model = await tf.loadLayersModel(
            `${process.env.PUBLIC_URL}/facerecog/model.json`
        );
        dispatch({
            type: SET_EMOTION_RECOGNITION_MODEL,
            payload: model
        });
    } catch (error) {
        console.error(error)
    }

};
