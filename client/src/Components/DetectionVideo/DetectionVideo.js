import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useSelector } from "react-redux";

export function DetectionVideo({
  videoRef,
  muted = false,
}) {

  const [faceapi, setFaceapi] = useState();
  const [emotionRecModel, setEmotionRecModel] = useState();
  const [userEmotion, setUserEmotion] = useState(
    "Detection initializing, please wait..."
  );
  let canvasRef = useRef(null);
  const videoWidth = 640;
  const videoHeight = 480;

  const faceapiReducer = useSelector((state) => state.modelReducer.faceapi);
  const emotionRecognitionReducer = useSelector((state) => state.modelReducer.emotionRecognition);
  let timeVarHolder;
  let unmountingVideoChat = useRef(null);
  useEffect(() => {
    console.log('mounting faceapi')
    if (faceapiReducer && !faceapi) {
      setFaceapi(faceapiReducer);
    }
    if (emotionRecognitionReducer && !emotionRecModel) {
      setEmotionRecModel(emotionRecognitionReducer);
    }

    return () => {
      clearTimeout(timeVarHolder);
      canvasRef = null;
      unmountingVideoChat.current = true;
    }
  }, [faceapiReducer, emotionRecognitionReducer])



  const predict = (data) => {
    if (emotionRecModel && data) {
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
        let ans = emotionRecModel.predict(data);
        ans = ans.dataSync();
        let maxPrediction = { value: 0, className: "" };
        for (let i = 0; i < ans.length; i++) {
          if (ans[i] * 100 > maxPrediction.value) {
            maxPrediction.value = ans[i] * 100;
            maxPrediction.className = classNames[i];
          }
        }
        if (maxPrediction) setUserEmotion(maxPrediction.className);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoOnPlay = () => {
    const videoToTensor = async () => {
      if (unmountingVideoChat && unmountingVideoChat.current) {
        return;
      }
      let canvases;
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          videoRef.current
        );
        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detections = await faceapi.detectAllFaces(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );
        //------------faceapi settings---------------
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );
        canvasRef.current
          .getContext("2d")
          .clearRect(0, 0, videoWidth, videoHeight);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        //------------------------------------------
        canvases = await faceapi.extractFaces(
          videoRef.current,
          resizedDetections
        );
      }
      let data = null;
      if (canvases.length > 0) {
        try {
          data = tf.browser
            .fromPixels(canvases[0], 3)
            .resizeNearestNeighbor([96, 96])
            // .mean(2)
            // .toFloat()
            .expandDims(0)
          // .expandDims(3);
        } catch (error) {
          console.log('error is', error.message)
          console.log("no face found");
        }
      }

      //tf.browser.toPixels((data.toFloat().div(tf.scalar(255.0))), canvasRef.current)
      if (emotionRecModel && data) {
        try {
          predict(data);
        } catch (error) {
          console.log(error);
        }
      }

      if (!videoRef.current.paused) {
        timeVarHolder = setTimeout(videoToTensor, 2000);
      }
    };
    videoToTensor();
  };
  const displayEmotions = faceapi && emotionRecModel
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          onPlay={displayEmotions ? handleVideoOnPlay : null}
          height={videoHeight}
          width={videoWidth}
        />
        <canvas
          style={{ position: "absolute" }}
          ref={canvasRef}
          height={videoHeight}
          width={videoWidth}
        />
        <div
          style={{
            backgroundColor: "black",
            marginTop: "-60px",
            width: videoWidth,
            color: "white",
            textAlign: "center",
            zIndex: 100,
          }}
        >
          <h3>{userEmotion}</h3>
        </div>
      </div>
    </>
  );
}
