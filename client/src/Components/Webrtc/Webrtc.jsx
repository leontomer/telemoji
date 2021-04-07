import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import { logoutUserFromSocket } from "../../actions/socketActions";
import { useSelector } from "react-redux";

const Container = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;


export function Webrtc({ match }) {
  const [stream, setStream] = useState();
  const [callerSignalState, setCallerSignalState] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const getStreamFromVideoCamera = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });
  };
  //webrtc
  const socket = useSelector((state) => state.socketReducer.socket);
  const callerSignal = useSelector((state) => state.callReducer.callerSignal)
  const callerSocketId = useSelector((state) => state.callReducer.callerSocketId)




  useEffect(() => {
    getStreamFromVideoCamera();
    if (socket) {
      if (match.params.callerId) {
        callPeer(match.params.callerId);
      } else if (callerSignal) {
        setCallerSignalState(callerSignal)
      }
    }

    return () => {
      logoutUserFromSocket();
    }
  }, [callerSignal, socket]);


  useEffect(() => {
    console.log('wah', callerSignalState, callerSocketId)
    if (callerSignalState && callerSocketId) {
      acceptCall()
    }
  }, [callerSignalState, callerSocketId])

  function callPeer(id) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "turn:34.76.85.113:3478",
            username: "guest",
            credential: "somepassword",
          },
        ],
      },
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        fromUser: socket.id
      });
    });

    peer.on("stream", (stream) => {
      console.log('callPear streaming', stream, 'partnerVideo.current', partnerVideo.current)
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      console.log('call accepted!!!', signal)
      setCallAccepted(true);
      peer.signal(signal);
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: callerSocketId });
    });

    peer.on("stream", (stream) => {
      console.log('acceptCall streaming!!!', stream);
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignalState);
  }


  let UserVideo;
  if (stream) {
    UserVideo = <DetectionVideo videoRef={userVideo} muted={true} />;
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <DetectionVideo videoRef={partnerVideo} />
    );
  }

  return (
    <Container>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
    </Container>
  );
}
