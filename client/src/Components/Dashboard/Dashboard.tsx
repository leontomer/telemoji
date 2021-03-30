import React, { useState } from "react";
import FriendInfoCard from "./FriendInfoCard/FriendInfoCard";
import FriendsList from "./FriendsList/FriendsList";
import { FriendProps } from "../../reducers/authReducer";
import FindUser from "./FindUser/FindUser";
import NotificationBar from "./NotificationBar/NotificationBar";
import WelcomeBanner from "./WelcomeBanner/WelcomeBanner";
import CallHistory from "./CallHistory/CallHistory";
import "./Dashboard.scss";

const Dashboard = () => {
  const [friendInFocus, setFriendInFocus] = useState<FriendProps | null>(null);
  return (
    <div className="dashboardContainer">
      <div className="welcomeBanner">
        <WelcomeBanner />
      </div>
      <div className="friendList">
        <FriendsList setFriendInFocus={setFriendInFocus} />
      </div>
      <div className="friendInfoCard">
        <FriendInfoCard friendInFocus={friendInFocus} />
      </div>
      <div className="callHistory">
        <CallHistory />
      </div>
    </div>
  );
};

export default Dashboard;
