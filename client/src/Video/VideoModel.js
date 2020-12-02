import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import * as tf from "@tensorflow/tfjs";

function VideoModel() {
  const [userEmotion, setUserEmotion] = useState("boom");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  let myModel;
  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = "/models";
        Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]).then(startVideo());
      } catch (error) {
        console.error(error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    (async function () {
      try {
        let model = await tf.loadLayersModel(
          `${process.env.PUBLIC_URL}/facerecog/model.json`
        );
        console.log("model loaded");
        myModel = model;
      } catch (error) {
        console.log("error is", error);
      }
    })();
  }, []);

  const startVideo = async () => {
    try {
      let stream = null;
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error(error);
    }
  };

  const predict = (data) => {
    console.log("data is", data);
    if (myModel && data) {
      try {
        let classNames = [
          "angry",
          "disgust",
          "fear",
          "happy",
          "neutral",
          "sad",
          "suprise",
        ];
        let ans = myModel.predict(data);
        ans = ans.dataSync();
        let maxPrediction = { value: 0, className: "" };
        for (let i = 0; i < ans.length; i++) {
          if (ans[i] * 100 > maxPrediction.value) {
            maxPrediction.value = ans[i] * 100;
            maxPrediction.className = classNames[i];
          }
        }
        console.log("ans is", maxPrediction);
        if (maxPrediction) setUserEmotion(maxPrediction.className);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoOnPlay = () => {
    let data = tf.browser.fromPixels(videoRef.current);
    console.log(data);
    const videoToTensor = async () => {
      let canvases;
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: 640,
          height: 480,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        console.log("detections are", detections);
        canvases = await faceapi.extractFaces(videoRef.current, detections);
      }
      let data = null;
      if (canvases.length > 0) {
        try {
          data = tf.browser
            .fromPixels(canvases[0], 4)
            .resizeNearestNeighbor([48, 48])
            .mean(2)
            .toFloat()
            .expandDims(0)
            .expandDims(-1);
        } catch (error) {
          console.log("no face found");
        }
      }

      //tf.browser.toPixels((data.toFloat().div(tf.scalar(255.0))), canvasRef.current)
      console.log(data);
      if (myModel && data) {
        try {
          console.log("predicting");

          predict(data);
        } catch (error) {
          console.log(error);
        }
      }

      if (!videoRef.current.paused) {
        setTimeout(videoToTensor, 20);
      }
    };
    videoToTensor();
  };
  return (
    <>
      <div>
        <video
          ref={videoRef}
          autoPlay
          muted
          onPlay={handleVideoOnPlay}
          height={340}
          width={340}
        />
        <canvas ref={canvasRef} height={1640} width={1640} />
      </div>
      <div
        style={{
          marginTop: -50,
          height: 50,
          width: 340,
          backgroundColor: "black",
          color: "white",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        <p>{userEmotion}</p>
      </div>
    </>
  );
}

export default VideoModel;
