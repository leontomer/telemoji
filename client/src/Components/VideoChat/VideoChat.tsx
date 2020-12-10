import * as React from 'react';
import { DetectionVideo } from '../DetectionVideo/DetectionVideo'
export const VideoChat = () => {
    const videoRef = React.useRef(null);
    React.useEffect(() => {
        startVideo();
    }, [])
    const startVideo = async () => {
        try {
            if (videoRef.current) {
                let stream = null;
                stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
                //@ts-ignore
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div>
            <DetectionVideo videoRef={videoRef} />
        </div>
    )
}


