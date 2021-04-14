import React, { useEffect, useState, useRef } from "react";
// import Peer from "simple-peer";
import styled from "styled-components";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import { useSelector, useDispatch } from "react-redux";
import { endCall } from '../../actions/callActions';
import { endCallForMyCaller } from '../../actions/socketActions';
import { withRouter } from "react-router";
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import Button from '@material-ui/core/Button';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const VideoRow = styled.div`
  display: flex;
  width: 100%;
  justify-content:center;
  align-items:center;
  margin-top:50px;
`;


const WebrtcComponent = ({ history, match }) => {
  const [stream, setStream] = useState();
  const [callerStream, setCallerStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();

  const callAcceptedReducer = useSelector((state) => state.callReducer.callAccepted);
  const userStream = useSelector((state) => state.callReducer.userStream);
  const callersStreamReducer = useSelector((state) => state.callReducer.callersStream);
  const socket = useSelector((state) => state.socketReducer.socket);
  const dispatch = useDispatch();

  const handleEndCall = () => {
    dispatch(endCallForMyCaller(match.params.callerId));
    dispatch(endCall());
    history.push('/');
  }
  useEffect(() => {
    return () => {
      handleEndCall();
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('endCall', () => {
        handleEndCall();
      })
    }
  }, [socket])
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
      <VideoRow>
        {UserVideo}
        {PartnerVideo}
      </VideoRow>
      <VideoRow>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PhoneDisabledIcon />}
          onClick={handleEndCall}
        >
          End Call
      </Button>
      </VideoRow>
    </Container>

  );
}
export const Webrtc = withRouter(WebrtcComponent);
