import React from "react";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      {" "}
      <Link to="/video-chat">
        <Button variant="contained">Chat</Button>
      </Link>
    </div>
  );
};

export default Dashboard;
