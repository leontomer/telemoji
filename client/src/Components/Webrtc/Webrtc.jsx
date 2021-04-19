import React, { useEffect, useState, useRef } from "react";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import { useSelector, useDispatch } from "react-redux";
import { endCall } from '../../actions/callActions';
import { endCallForMyCaller } from '../../actions/socketActions';
import { withRouter } from "react-router";
import PhoneDisabledIcon from '@material-ui/icons/PhoneDisabled';
import Button from '@material-ui/core/Button';
import './Webrtc.scss';
import { useLoader } from '../../Contexts/LoaderContext';



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
  // const { callingUser } = useSelector((state) => state.callReducer)
  const handleEndCall = () => {
    dispatch(endCallForMyCaller(match.params.callerId));
    dispatch(endCall());
    history.push('/');
  }

  const { startLoading, finishLoading } = useLoader();
  // useEffect(() => {
  //   if (!callingUser && !callAcceptedReducer) {
  //     history.push('/');
  //   }
  // }, [callAcceptedReducer, callingUser])

  useEffect(() => {
    startLoading();
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
      finishLoading();
      partnerVideo.current.srcObject = callerStream;
    }
  }, [callerStream])


  let UserVideo;
  if (stream) {
    UserVideo = <DetectionVideo videoRef={userVideo} muted={true} />;
  }

  let PartnerVideo;
  if (callAccepted) {
    finishLoading();
    PartnerVideo = (
      <DetectionVideo videoRef={partnerVideo} />
    );
  }

  return (
    <div className="webrtcContainer">
      <div className="endCall">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PhoneDisabledIcon />}
          onClick={() => history.push('/')}
        >
          End Call
      </Button>
      </div>
      <div className="videoRow">
        {PartnerVideo}
        {UserVideo}
      </div>
    </div >

  );
}
export const Webrtc = withRouter(WebrtcComponent);
