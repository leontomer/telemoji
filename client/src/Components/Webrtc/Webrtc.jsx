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
import Popover from "@material-ui/core/Popover";
import Typography from "@material-ui/core/Typography";

const WebrtcComponent = ({ history, match }) => {
  const [stream, setStream] = useState();
  const [callerStream, setCallerStream] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  // @ts-ignore
  const callAcceptedReducer = useSelector((state) => state.callReducer.callAccepted);
  // @ts-ignore
  const userStream = useSelector((state) => state.callReducer.userStream);
  // @ts-ignore
  const callersStreamReducer = useSelector((state) => state.callReducer.callersStream);
  // @ts-ignore
  const socket = useSelector((state) => state.socketReducer.socket);
  const dispatch = useDispatch();
  // @ts-ignore
  const selectedEmotion = useSelector((state) => state.modelReducer.selectedEmotion);
  // const { callingUser } = useSelector((state) => state.callReducer)
  const handleEndCall = () => {
    dispatch(endCallForMyCaller(match.params.callerId));
    dispatch(endCall());
    history.push('/dashboard');
  }

  const { startLoading, finishLoading } = useLoader();
  // useEffect(() => {
  //   if (!callingUser && !callAcceptedReducer) {
  //     history.push('/');
  //   }
  // }, [callAcceptedReducer, callingUser])

  useEffect(() => {
    startLoading();
    setTimeout(() => {
      finishLoading()
    }, 5000);
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
    UserVideo =
      <div className={callAccepted ? "userVideo" : ""}>
        <video
          ref={userVideo}
          muted
          autoPlay
          height={100}
          width={130}
        />
      </div>
  }

  let PartnerVideo;
  const popoverRef = useRef(null)
  const handleClose = () => {
    // popoverRef.current = null;
    setOpenPopUp(false);
  };
  const [openPopUp, setOpenPopUp] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState('');
  const popMessageAndHide = (message) => {
    setPopUpMessage(message)
    setOpenPopUp(true)
    setTimeout(() => {
      setOpenPopUp(false);
    }, 3000)
  }
  useEffect(() => {
    if (selectedEmotion === "happy") {
      popMessageAndHide(" Good job your call friend is happy! 😄")
    }
    if (selectedEmotion === "sad") {
      popMessageAndHide(" Oh oh your call friend is sad, try to tell something funny!!😕")
    }

    if (selectedEmotion === "disgust") {
      popMessageAndHide(" Oh oh your call friend is disgusted, try to change the subject 🤢")
    }

    if (selectedEmotion === "suprise") {
      popMessageAndHide("Cool you managed to suprise your friend 😱")
    }

    if (selectedEmotion === "angry") {
      popMessageAndHide("Oh no your call friend is angry! try to tell something nice 😡")
    }

    if (selectedEmotion === "scared") {
      popMessageAndHide("Your call friend is scared! how did you do that? 😰")
    }

  }, [selectedEmotion])
  if (callAccepted) {
    finishLoading();
    PartnerVideo = (
      <>
        <div ref={popoverRef} style={{ marginBottom: 20 }}>
          {popoverRef.current && (
            <Popover
              open={openPopUp}
              anchorEl={popoverRef.current}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <div style={{ padding: 20 }}>
                <Typography>
                  {popUpMessage}
                </Typography>
              </div>

            </Popover>
          )}
        </div>
        <DetectionVideo videoRef={partnerVideo} />
      </>
    );
  }

  return (
    <div className="webrtcContainer">
      <div className="endCall">
        <Button
          variant="contained"
          color="secondary"
          startIcon={<PhoneDisabledIcon />}
          onClick={() => history.push('/dashboard')}
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
