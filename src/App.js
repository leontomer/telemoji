import React, { useRef, useEffect } from 'react';
import './App.css'
import { DetectionVideo } from './components/DetectionVideo/DetectionVideo';

function App() {
  const videoRef = useRef(null);
  useEffect(() => {
    startVideo();
  }, [])
  const startVideo = async () => {
    try {
      if (videoRef.current) {
        let stream = null;
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <DetectionVideo videoRef={videoRef} />
    </div>
  );
}

export default App;
