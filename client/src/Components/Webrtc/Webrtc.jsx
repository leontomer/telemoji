import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import { RecieveCallModal } from "../Modals/RecieveCallModal";
import { makeStyles } from "@material-ui/core/styles";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
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

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

export function Webrtc() {
  const classes = useStyles();
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [onCall, setOnCall] = useState(null);
  const [yourName, setYourName] = useState("");

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const addNameToServer = () => {
    socket.current.emit("new username", yourName);
  };

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
  const firstName = useSelector((state) => state.authReducer.user.firstName);
  const lastName = useSelector((state) => state.authReducer.user.lastName);
  useEffect(() => {
    // socket.current = io.connect("/");
    setYourName(`${firstName} ${lastName}`);
    getStreamFromVideoCamera();
    // socket.current.on("yourID", (id) => {
    //   setYourID(id);
    // });
    // socket.current.on("allUsers", (users) => {
    //   setUsers(users);
    // });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    return () => {
      socket.current.emit("logout")
    }
  }, []);

  useEffect(() => {
    if (yourName) {
      addNameToServer();
    }
  }, [yourName])

  function callPeer(id) {
    setOnCall(id);
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
      socket.current.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: yourID,
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

  const callList = Object.keys(users).map((key) => {
    if (key === yourID || key === caller || (callAccepted && key === onCall)) {
      return null;
    }
    if (key === onCall && !callAccepted)
      return (
        <ListItem>
          <ListItemText primary={`Calling ${users[onCall].name}`} />
        </ListItem>
      );
    return (
      users[key].name && (
        <ListItem button onClick={() => callPeer(key)}>
          <ListItemText primary={`Call ${users[key].name}`} />
        </ListItem>
      )
    );
  });

  return (
    <Container>
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
      <RecieveCallModal
        open={receivingCall}
        setOpen={setReceivingCall}
        caller={users[caller] && users[caller].name}
        acceptCall={acceptCall}
      />
    </Container>
  );
}
