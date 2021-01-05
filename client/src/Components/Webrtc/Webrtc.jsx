import * as React from "react";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import io from "socket.io-client";
import styled from "styled-components";
import Button from "@material-ui/core/Button";
import Peer from "simple-peer";
import { SetYourNameModal } from '../Modals/SetYourNameModal'
import { RecieveCallModal } from '../Modals/RecieveCallModal'

import { makeStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';


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

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));


function App() {
  const classes = useStyles();
  const [yourName, setYourName] = React.useState('');
  const [openNameModal, setOpenNameModal] = React.useState(false);
  const [yourID, setYourID] = React.useState("");
  const [users, setUsers] = React.useState({});
  const [stream, setStream] = React.useState();
  const [receivingCall, setReceivingCall] = React.useState(false);
  const [caller, setCaller] = React.useState({
    callerName: '',
    callerID: ''
  });
  const [callerSignal, setCallerSignal] = React.useState();
  const [callAccepted, setCallAccepted] = React.useState(false);

  const userVideo = React.useRef();
  const partnerVideo = React.useRef();
  const socket = React.useRef();


  React.useEffect(() => {
    socket.current = io.connect("/");
    setOpenNameModal(true);
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      setStream(stream);
      if (userVideo.current) {
        userVideo.current.srcObject = stream;
      }
    })

    socket.current.on("yourID", (id) => {
      setYourID(id);
    })
    socket.current.on("allUsers", (users) => {
      console.log('setting users', users);
      setUsers(users);
    })

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller({ callerName: data.callerName, callerID: data.callerID });
      setCallerSignal(data.signal);
    })
  }, []);


  const addNameToServer = () => {
    socket.current.emit('new username', { username: yourName, userID: yourID })
    setOpenNameModal(false);
  }
  function callPeer(id, callername) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            urls: "stun:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
          {
            urls: "turn:numb.viagenie.ca",
            username: "sultan1640@gmail.com",
            credential: "98376683",
          },
        ],
      },
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        callerName: callername,
        callerID: yourID,
      });
    });

    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
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
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    // need to fix callPeer(caller.callerID, caller.callerName)
  }

  let UserVideo;
  if (stream) {
    UserVideo = <DetectionVideo videoRef={userVideo} />;
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = (
      <>
        <DetectionVideo videoRef={partnerVideo} />
      </>
    );
  }

  const callList = Object.entries(users).map(([_, { userID, username }]) => {
    if (userID != yourID) {
      return (
        <ListItem button onClick={() =>
          callPeer(userID, yourName)
        }>
          <ListItemText primary={`Call ${username}`} />
        </ListItem>
      )
    }
  })
  return (
    <Container>
      <SetYourNameModal name={yourName} setName={setYourName} open={openNameModal} setOpen={addNameToServer} />
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
      <Row>
        <List
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Users to chat
        </ListSubheader>
          }
          className={classes.root}
        >
          {callList}
        </List>
      </Row>
      <RecieveCallModal open={receivingCall} setOpen={setReceivingCall} caller={caller.callerName} acceptCall={acceptCall} />
    </Container>
  );
}

export default App;
