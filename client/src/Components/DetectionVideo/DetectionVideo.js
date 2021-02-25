import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "@vladmandic/face-api/dist/face-api.esm.js";
import * as tf from "@tensorflow/tfjs";

export function DetectionVideo({ videoRef, displayEmotions = false, muted = false }) {
  const [userEmotion, setUserEmotion] = useState("Detection initializing, please wait...");
  const canvasRef = useRef(null);
  const videoWidth = 640;
  const videoHeight = 480;
  let myModel;
  useEffect(() => {
    if (displayEmotions) {
      const loadModels = async () => {
        try {
          const MODEL_URL = "/models";
          Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
            faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
            faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          ]);
        } catch (error) {
          console.error(error);
        }
      };
      loadModels();
    }
    else {
      setUserEmotion(' Your video')
    }

  }, []);

  useEffect(() => {
    if (displayEmotions) {
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
    }
  }, []);


  const predict = (data) => {
    // console.log("data is", data);
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
        //console.log("ans is", maxPrediction);
        if (maxPrediction) setUserEmotion(maxPrediction.className);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleVideoOnPlay = () => {
    const videoToTensor = async () => {
      let canvases;
      if (videoRef.current && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
        const displaySize = {
          width: videoWidth,
          height: videoHeight
        }
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const detections = await faceapi.
          detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        //------------faceapi settings---------------
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvasRef.current.getContext('2d').clearRect(0, 0, videoWidth, videoHeight);
        faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
        //------------------------------------------
        canvases = await faceapi.extractFaces(videoRef.current, resizedDetections)
      }
      let data = null;
      if (canvases.length > 0) {
        try {
          data = tf.browser.fromPixels(canvases[0], 4)
            .resizeNearestNeighbor([48, 48])
            .mean(2)
            .toFloat()
            .expandDims(0)
            .expandDims(-1)
        } catch (error) {
          console.log('no face found');
        }

      }

      //tf.browser.toPixels((data.toFloat().div(tf.scalar(255.0))), canvasRef.current)
      if (myModel && data) {
        try {
          //console.log('predicting');
          predict(data);

        } catch (error) {
          console.log(error);
        }
      }

      if (!videoRef.current.paused) {
        setTimeout(videoToTensor, 2000);
      }
    }
    videoToTensor();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <video
          ref={videoRef}
          autoPlay
          muted={muted}
          onPlay={displayEmotions ? handleVideoOnPlay : null}
          height={videoHeight}
          width={videoWidth}
        />
        <canvas style={{ position: 'absolute' }} ref={canvasRef} height={videoHeight} width={videoWidth} />
        <div style={{ backgroundColor: 'black', marginTop: '-60px', width: videoWidth, color: 'white', textAlign: 'center' }}>
          <h3>{userEmotion}</h3>
        </div>
      </div>
    </>
  );
}

