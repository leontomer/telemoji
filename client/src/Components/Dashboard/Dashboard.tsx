import React from "react";
import FriendInfoCard from "./FriendInfoCard/FriendInfoCard";
import FriendsList from "./FriendsList/FriendsList";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";
import CallHistory from "./CallHistory/CallHistory";
import Typography from "@material-ui/core/Typography";
import { useSpring, animated } from 'react-spring'
import "./Dashboard.scss";

const Dashboard = () => {

  const moveFromTop = useSpring({
    delay: 300,
    from: { y: -100, opacity: 0 },
    to: { y: 0, opacity: 1 },
  })

  const moveFromBottom = useSpring({
    delay: 500,
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
  })
  const moveFromBottomDelay = useSpring({
    delay: 700,
    from: { y: 100, opacity: 0 },
    to: { y: 0, opacity: 1 },
  })

  const moveFromLeft = useSpring({
    delay: 900,
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1 },
  })


  return (
    <div className="dashboardContainer">
      <animated.div style={{ ...moveFromTop }} className="welcomeBanner">
        <WelcomeBanner />
      </animated.div>
      <animated.div className="friendList" style={{ ...moveFromLeft }}>
        <FriendsList />
      </animated.div>
      <animated.div className="friendInfoCard" style={{ ...moveFromBottomDelay }}>
        <FriendInfoCard />
      </animated.div>
      <animated.div className="callHistory" style={{ ...moveFromBottom }}>
        <CallHistory />
      </animated.div>
      <div className="footer">
        <Typography style={{ marginTop: 15 }}> © Copyright 2021 Telemoji. All rights reserved.</Typography>
      </div>
    </div>
  );
};

export default Dashboard;
