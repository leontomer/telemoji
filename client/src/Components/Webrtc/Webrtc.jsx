import React, { useEffect, useState, useRef } from "react";
// import Peer from "simple-peer";
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


export function Webrtc() {
  const [stream, setStream] = useState();
  const [callerStream, setCallerStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();

  const callAcceptedReducer = useSelector((state) => state.callReducer.callAccepted);
  const userStream = useSelector((state) => state.callReducer.userStream);
  const callersStreamReducer = useSelector((state) => state.callReducer.callersStream)


  useEffect(() => {
    return () => {
      logoutUserFromSocket();
    }
  }, []);


  useEffect(() => {
    setCallAccepted(callAcceptedReducer)
  }, [callAcceptedReducer]);

  useEffect(() => {
    setStream(userStream);
  }, [userStream])

  useEffect(() => {
    if (userVideo.current && stream) {
      userVideo.current.srcObject = stream;
    }
  }, [stream])

  useEffect(() => {
    setCallerStream(callersStreamReducer)
  }, [callersStreamReducer])

  useEffect(() => {
    if (partnerVideo.current && callerStream) {
      partnerVideo.current.srcObject = callerStream;
    }
  }, [callerStream])


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
