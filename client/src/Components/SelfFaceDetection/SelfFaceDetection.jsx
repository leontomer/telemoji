import React, { useRef, useEffect, useState } from 'react'
import { DetectionVideo } from '../DetectionVideo/DetectionVideo';

const SelfFaceDetection = () => {


    const [stream, setStream] = useState();
    // @ts-ignore

    const userVideo = useRef();


    useEffect(() => {
        if (userVideo.current && stream) {
            userVideo.current.srcObject = stream;
        }
    }, [stream])

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({
                audio: true, video: {
                    width: 1040,
                    height: 880
                }
            })
            .then((stream) => {
                setStream(stream)
            });
    }, [])

    return (
        <div>
            <DetectionVideo
                ref={userVideo}
            />;
        </div>
    )
}

export default SelfFaceDetection