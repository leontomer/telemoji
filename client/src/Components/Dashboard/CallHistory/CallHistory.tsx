import React from "react";
import NotificationBar from "../NotificationBar/NotificationBar";
import "./CallHistory.scss";
const CallHistory = () => {
  return <div className="callHistoryContainer">
    <NotificationBar numberOfPendingFriendRequest={5}/>
  </div>;
};

export default CallHistory;
