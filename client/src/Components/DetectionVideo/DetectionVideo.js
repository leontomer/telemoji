import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { useSelector, useDispatch } from "react-redux";
import { setMessage } from "../../actions/errorsActions";
import { snackbarType } from "../../Common/dataTypes";
import {
  setEmotion,
  setCallEmotionStats,
  loadEmotionRecognitionModel,
  loadBlazeface,
  loadFaceapi
} from "../../actions/modelActions";
import lan from "../../Languages/Languages.json";


export function DetectionVideo({ videoRef, muted = false }) {
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);

  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);


  // if (language == "En") {
  const classNames = [
    "angry",
    "disgust",
    "fear",
    "happy",
    "neutral",
    "sad",
    "surprise",
  ];
  // } else {
  const hebrewClassNames = ["עצבני", "נגעל", "מפחד", "שמח", "ניטרלי", "עצוב", "מופתע"];
  // }

  const [userEmotion, setUserEmotion] = useState(lan[language].detection);
  const [detectFaceMessage, setDetecFaceMessage] = useState('')
  let canvasRef = useRef(null);
  const videoWidth = window.innerWidth < 640 ? window.innerWidth : 640;
  const videoHeight = 480;

  const dispatch = useDispatch();
  const faceapi = useSelector((state) => state.modelReducer.faceapi);
  const blazeFace = useSelector((state) => state.modelReducer.blazeFace);
  const emotionRecognition85p = useSelector(
    (state) => state.modelReducer.emotionRecognition85p
  );

  let timeVarHolder;
  let unmountingVideoChat = useRef(null);
  useEffect(() => {
    return () => {
      clearTimeout(timeVarHolder);
      setCallEmotionStats(emotionStats.current);
      canvasRef = null;
      unmountingVideoChat.current = true;
    };
  }, []);

  useEffect(() => {
    if (!faceapi) {
      dispatch(loadFaceapi())
    }
    if (!blazeFace) {
      dispatch(loadBlazeface())
    }
    if (!emotionRecognition85p) {
      dispatch(loadEmotionRecognitionModel())
    }

  }, [faceapi, blazeFace, emotionRecognition85p])

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
        let maxPrediction = { value: 0, className: "", index: 0 };

        for (let i = 0; i < ans.length; i++) {
          if (ans[i] > maxPrediction.value) {
            maxPrediction.value = ans[i];
            maxPrediction.className = classNames[i];
            maxPrediction.index = i
          }
        }
        if (maxPrediction) {
          emotionStats.current[maxPrediction.className]++;
          if (userEmotion !== maxPrediction.className) {
            setUserEmotion(language == "En" ? maxPrediction.className : hebrewClassNames[maxPrediction.index]);
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
        dispatch(
          setMessage(
            "Call has ended",
            JSON.stringify(error),
            snackbarType.error
          )
        );
      }
    }
  };

  const handleVideoOnPlay = () => {
    setUserEmotion(lan[language].detection_try);
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
          const faceApiFacedetections = await faceapi.detectAllFaces(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
          );
          const blazeFaceApiFacedetections = await blazeFace.estimateFaces(videoRef.current, false);
          let regionsToExtract
          if (blazeFaceApiFacedetections.length > 0) {
            regionsToExtract = [
              new faceapi.Rect(blazeFaceApiFacedetections[0].topLeft[0],
                blazeFaceApiFacedetections[0].topLeft[1],
                blazeFaceApiFacedetections[0].bottomRight[0] - blazeFaceApiFacedetections[0].topLeft[0],
                blazeFaceApiFacedetections[0].bottomRight[1] - blazeFaceApiFacedetections[0].topLeft[1])
            ]
          }

          //------------faceapi settings---------------
          // const resizedDetections = faceapi.resizeResults(
          //   detections,
          //   displaySize
          // );
          // canvasRef.current
          //   .getContext("2d")
          //   .clearRect(0, 0, videoWidth, videoHeight);
          // faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          //------------------------------------------
          const detections = faceApiFacedetections.length > 0 ? faceApiFacedetections : regionsToExtract ? regionsToExtract : null
          canvases = detections && await faceapi.extractFaces(
            videoRef.current,
            detections
          );
        }
        let data = null;
        if (!canvases || canvases.length === 0) {
          setDetecFaceMessage(lan[language].detection_fail);
        }
        if (canvases && canvases.length > 0) {
          setDetecFaceMessage('')
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
        console.error(error)
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
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          overflow: "hidden",
          backgroundColor: "black",
          borderRadius: "50px",
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
          <span style={{ fontSize: '25px', color: 'red' }}>{detectFaceMessage}</span>
        </div>
      </div>
    </div>
  );
}
