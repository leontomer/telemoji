import React from "react";
import FriendInfoCard from "./FriendInfoCard/FriendInfoCard";
import FriendsList from "./FriendsList/FriendsList";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";
import CallHistory from "./CallHistory/CallHistory";
import Typography from "@material-ui/core/Typography";
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className="dashboardContainer">
      <div className="welcomeBanner">
        <WelcomeBanner />
      </div>
      <div className="friendList">
        <FriendsList />
      </div>
      <div className="friendInfoCard">
        <FriendInfoCard />
      </div>
      <div className="callHistory">
        <CallHistory />
      </div>
      <div className="footer">
        <Typography style={{ marginTop: 15 }}> © Copyright 2021 Telemoji. All rights reserved.</Typography>
      </div>
    </div>
  );
};

export default Dashboard;
