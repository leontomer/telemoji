import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import { setEmotion, setCallEmotionStats } from "../../actions/modelActions";

export function DetectionVideo({ videoRef, muted = false }) {
  const [faceapi, setFaceapi] = useState();
  // const [emotionRecModel, setEmotionRecModel] = useState({});
  const [userEmotion, setUserEmotion] = useState(
    "Detection initializing, please wait..."
  );
  let canvasRef = useRef(null);
  const videoWidth = window.innerWidth < 640 ? window.innerWidth : 640;
  const videoHeight = 480;

  const dispatch = useDispatch();
  const faceapiReducer = useSelector((state) => state.modelReducer.faceapi);
  const emotionRecognition85p = useSelector(
    (state) => state.modelReducer.emotionRecognition85p
  );

  let timeVarHolder;
  let unmountingVideoChat = useRef(null);
  useEffect(() => {
    console.log("mounting faceapi");
    if (faceapiReducer && !faceapi) {
      setFaceapi(faceapiReducer);
    }

    return () => {
      clearTimeout(timeVarHolder);
      dispatch(setCallEmotionStats(emotionStats.current));
      canvasRef = null;
      unmountingVideoChat.current = true;
    };
  }, [faceapiReducer]);

  const classNames = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise",
  ];
  const emotionStats = React.useRef({
    happy: 0,
    sad: 0,
    disgust: 0,
    neutral: 0,
    surprise: 0,
    angry: 0,
    fear: 0,
  });
  const setEmotionDelay = useRef(false);

  const predict = (data) => {
    if (emotionRecognition85p && data) {
      try {
        let pred85 = emotionRecognition85p.predict(data);
        pred85 = pred85.dataSync();
        let ans = [];
        for (let i = 0; i < pred85.length; i++) {
          ans[i] = pred85[i];
        }
        let maxPrediction = { value: 0, className: "" };

        for (let i = 0; i < ans.length; i++) {
          if (ans[i] > maxPrediction.value) {
            maxPrediction.value = ans[i];
            maxPrediction.className = classNames[i];
          }
        }
        if (maxPrediction) {
          emotionStats.current[maxPrediction.className]++;
          if (userEmotion !== maxPrediction.className) {
            setUserEmotion(maxPrediction.className);
            if (!setEmotionDelay.current) {
              dispatch(setEmotion(maxPrediction.className));
              setEmotionDelay.current = true;
              setTimeout(() => {
                setEmotionDelay.current = false;
              }, 1000);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoOnPlay = () => {
    setUserEmotion("Trying to detect your face...");
    const videoToTensor = async () => {
      try {
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
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          //------------------------------------------
          canvases = await faceapi.extractFaces(
            videoRef.current,
            resizedDetections
          );
        }
        let data = null;
        // if (!canvases || canvases.length === 0) {
        //   // setUserEmotion("Trying to detect your face...");
        // }
        if (canvases && canvases.length > 0) {
          try {
            data = tf.browser
              .fromPixels(canvases[0], 3)
              .resizeNearestNeighbor([96, 96])
              // .mean(2)
              // .toFloat()
              .expandDims(0);
            // .expandDims(3);
          } catch (error) {
            console.log("error is", error.message);
            console.log("no face found");
          }
        }

        //tf.browser.toPixels((data.toFloat().div(tf.scalar(255.0))), canvasRef.current)
        if (data) {
          try {
            predict(data);
          } catch (error) {
            console.log(error);
          }
        }

        if (!videoRef.current.paused) {
          timeVarHolder = setTimeout(videoToTensor, 300);
        }
      } catch (error) {
        dispatch(
          setMessage(
            "Call has ended",
            JSON.stringify(error),
            snackbarType.error
          )
        );
      }
      //
    };
    videoToTensor();
  };

  const displayEmotions = faceapi;
  return (
    <div style={{ backgroundColor: "#53317e", padding: 60, borderRadius: 40 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
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
            width: videoWidth,
            color: "white",
            textAlign: "center",
            fontSize: 40,
            zIndex: 100,
          }}
        >
          <h3>{userEmotion}</h3>
        </div>
      </div>
    </div>
  );
}
