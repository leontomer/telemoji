import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Pagination from "@material-ui/lab/Pagination";
import Moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CallMadeIcon from "@material-ui/icons/CallMade";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { loadUser } from "../../../actions/authActions";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import "./CallHistory.scss";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const CallHistory = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // @ts-ignore
  const globalCallHistory = useSelector((state) => state.authReducer.user.callHistory);
  // @ts-ignore
  const usersImage = useSelector((state) => state.authReducer.user.imageAddress);

  const [callHistory, setCallHistory] = useState([
    globalCallHistory.callHistory,
  ]);
  useEffect(() => {
    dispatch(loadUser());
  }, []);

  useEffect(() => {
    setCallHistory(globalCallHistory);
  }, [globalCallHistory]);

  const [selectedPage, setSelectedPage] = useState(1);
  const handlePagination = (e, page) => {
    setSelectedPage(page);
  };
  const pageCount = 5;

  const domTarget = useRef(null);
  const [{ rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 350, friction: 40 }
    })
  );


  const [wheelApi] = useSpring(() => ({ wheelY: 0 }));

  useGesture(
    {
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api.start({
          scale: 1.05
        }),
      onHover: ({ hovering }) =>
        !hovering && api.start({ rotateX: 0, rotateY: 0, scale: 1 })
    },
    { domTarget, eventOptions: { passive: false } }
  );



  return (
    <animated.div className="callHistoryContainer" ref={domTarget}
      style={{
        transform: "perspective(600px)",
        scale: to([scale, zoom], (s, z) => s + z),
        rotateX,
        rotateY,
        rotateZ
      }}>
      <Typography variant="h5" component="h5" style={{ textAlign: "center" }}>
        Call History
      </Typography>
      <List className={classes.root}>
        {callHistory
          .slice(0)
          .reverse()
          .slice(pageCount * selectedPage - pageCount, pageCount * selectedPage)
          .map(
            (call, index) =>
              call && (
                <ListItem button key={index}>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: "#27AE60 " }}>
                      <CallMadeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <AvatarGroup style={{ marginRight: 5 }}>
                    <Avatar src={usersImage} />
                    <Avatar src={call.callerImage} />
                  </AvatarGroup>
                  <ListItemText
                    primary={call.callerName}
                    secondary={Moment(call.date).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  />
                </ListItem>
              )
          )}
      </List>
      <div style={{ marginTop: 10 }}>
        {callHistory.length > 0 && (
          <Pagination
            count={Math.ceil(callHistory.length / 5)}
            color="primary"
            onChange={handlePagination}
          />
        )}
      </div>
    </animated.div>
  );
};

export default CallHistory;
