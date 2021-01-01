import * as React from "react";
import { DetectionVideo } from "../DetectionVideo/DetectionVideo";
import io from "socket.io-client";
import styled from "styled-components";

import Peer from "simple-peer";



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




function App() {
  const [yourID, setYourID] = React.useState("");
  const [users, setUsers] = React.useState({});
  const [stream, setStream] = React.useState();
  const [receivingCall, setReceivingCall] = React.useState(false);
  const [caller, setCaller] = React.useState("");
  const [callerSignal, setCallerSignal] = React.useState();
  const [callAccepted, setCallAccepted] = React.useState(false);

  const userVideo = React.useRef();
  const partnerVideo = React.useRef();
  const socket = React.useRef();
  const canvasRef = React.useRef();

  React.useEffect(() => {
    socket.current = io.connect("/");
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        
        setStream(stream);
        if (userVideo.current) {
          
          userVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourID", (id) => {
      setYourID(id);
    });
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    socket.current.on("hey", (data) => {
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });
  }, []);

 

  function callPeer(id) {
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

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    );
  }
  console.log("users::::", users);
  return (
    <Container>
    <Row>
      {UserVideo}
      {PartnerVideo}
    </Row>
    <Row>
      {Object.keys(users).map((key) => {
        if (key === yourID) {
          return null;
        }
        return <button onClick={() => callPeer(key)}>Call {key}</button>;
      })}
    </Row>
    <Row>{incomingCall}</Row>
  </Container>
  );
}

export default App;
