import React from "react";
import FriendInfoCard from "./FriendInfoCard/FriendInfoCard";
import FriendsList from "./FriendsList/FriendsList";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";
import CallHistory from "./CallHistory/CallHistory";
import Typography from "@material-ui/core/Typography";
import "./Dashboard.scss";
import { Button } from "@material-ui/core";
import { sendResetPasswordEmail } from "../../actions/usersActions";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const dispatch = useDispatch();
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
        <Typography style={{ marginTop: 15 }}>
          © Copyright 2021 Telemoji. All rights reserved.
        </Typography>
      </div>
      <div>
        <Button
          onClick={() => {
            dispatch(sendResetPasswordEmail());
          }}
        >
          send mail
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
