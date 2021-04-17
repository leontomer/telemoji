import React, { useEffect } from "react";
import "./CallHistory.scss";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Moment from "moment";

const CallHistory = () => {
  const globalCallHistory = useSelector(
    (state) => state.authReducer.user.callHistory
  );
  const [callHistory, setCallHistory] = React.useState([
    globalCallHistory.callHistory,
  ]);

  useEffect(() => {
    setCallHistory(globalCallHistory);
    console.log(globalCallHistory);
  }, [globalCallHistory]);

  return (
    <div className="callHistoryContainer">
      <Typography variant="h3" component="h3">
        Call History
      </Typography>
      {callHistory
        .slice(0)
        .reverse()
        .map((call, index) => {
          return (
            <ListItem key={index}>
              {call && index <= 3 && (
                <ListItemText primary={call.friendName} secondary={call.date} />
              )}
            </ListItem>
          );
        })}
    </div>
  );
};

export default CallHistory;
