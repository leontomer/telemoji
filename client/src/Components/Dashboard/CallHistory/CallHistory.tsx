import React, { useEffect } from "react";
import "./CallHistory.scss";
import Typography from "@material-ui/core/Typography";
import { useSelector } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Moment from "moment";
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CallMadeIcon from '@material-ui/icons/CallMade';
import AvatarGroup from '@material-ui/lab/AvatarGroup';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));


const CallHistory = () => {
  const classes = useStyles();

  const globalCallHistory = useSelector(
    (state) => state.authReducer.user.callHistory
  );
  const usersImage = useSelector((state) => state.authReducer.user.imageAddress)
  const [callHistory, setCallHistory] = React.useState([
    globalCallHistory.callHistory,
  ]);

  useEffect(() => {
    setCallHistory(globalCallHistory);
    console.log(globalCallHistory);
  }, [globalCallHistory]);

  return (
    <div className="callHistoryContainer">
      <Typography variant="h5" component="h5" style={{ textAlign: 'center' }}>
        Call History
      </Typography>
      <List className={classes.root}>
        {callHistory
          .slice(0)
          .reverse()
          .map((call, index) => call && <ListItem button>
            <ListItemAvatar>
              <Avatar style={{ backgroundColor: '#27AE60 ' }}>
                <CallMadeIcon />
              </Avatar>
            </ListItemAvatar>
            <AvatarGroup style={{ marginRight: 5 }}>
              <Avatar src={usersImage} />
              <Avatar src={call.callerImage} />
            </AvatarGroup>
            <ListItemText primary={call.callerName} secondary={Moment(call.date).format('MMMM Do YYYY, h:mm:ss a')} />
          </ListItem>)}
      </List>
    </div>
  );
};

export default CallHistory;
