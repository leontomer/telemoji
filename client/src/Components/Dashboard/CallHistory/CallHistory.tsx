import React, { useState, useEffect, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import { useSelector, useDispatch } from "react-redux";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Pagination from "@material-ui/lab/Pagination";
import Moment from "moment";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import CallMadeIcon from "@material-ui/icons/CallMade";
import AvatarGroup from "@material-ui/lab/AvatarGroup";
import { loadUser } from "../../../actions/authActions";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import SwipeableViews from "react-swipeable-views";
import Statistics from "./Statistics/Statistics";

import "./CallHistory.scss";
import lan from "../../../Languages/Languages.json";

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
  const globalCallHistory = useSelector(
    // @ts-ignore
    (state) => state.authReducer.user.callHistory
  );
  // @ts-ignore
  const usersImage = useSelector(
    // @ts-ignore

    (state) => state.authReducer.user.imageAddress
  );
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);

  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
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
  const theme = useTheme();
  const domTarget = useRef(null);
  const [{ rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    zoom: 0,
    x: 0,
    y: 0,
    config: { mass: 5, tension: 350, friction: 40 },
  }));

  useGesture(
    {
      onMove: ({ dragging }) =>
        !dragging &&
        api.start({
          scale: 1.05,
        }),
      onHover: ({ hovering }) =>
        !hovering && api.start({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } }
  );

  const [value, setValue] = React.useState(0);
  const [callId, setCallId] = React.useState("");
  const [callerStatsName, setCallerStatsName] = React.useState("");
  useEffect(() => {
    setValue(1);
  }, []);

  const handleHistorySelect = ({ callId, callerName }) => {
    setValue(2);
    setCallId(callId);
    setCallerStatsName(callerName);
  };

  return (
    <animated.div
      className="callHistoryContainer"
      ref={domTarget}
      style={{
        transform: "perspective(600px)",
        scale: to([scale, zoom], (s, z) => s + z),
        rotateX,
        rotateY,
        rotateZ,
      }}
    >
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
      >
        <SwipePanel value={value} index={0}></SwipePanel>
        <SwipePanel value={value} index={1}>
          <Typography
            variant="h5"
            component="h5"
            style={{ textAlign: "center" }}
          >
            {lan[language].call_history}
          </Typography>

          {callHistory.length == 0 && (
            <Typography
              variant="subtitle2"
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                textAlign: "center",
                marginTop: "5px",
              }}
            >
              {lan[language].no_calls}
            </Typography>
          )}

          <List className={classes.root}>
            {callHistory
              .slice(0)
              .reverse()
              .slice(
                pageCount * selectedPage - pageCount,
                pageCount * selectedPage
              )
              .map(
                (call, index) =>
                  call && (
                    <ListItem
                      button
                      key={index}
                      onClick={() =>
                        handleHistorySelect({
                          callId: call._id,
                          callerName: call.callerName,
                        })
                      }
                    >
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
                page={selectedPage}
              />
            )}
          </div>
        </SwipePanel>
        <SwipePanel value={value} index={2}>
          <Statistics
            goback={() => setValue(1)}
            callId={callId}
            callerStatsName={callerStatsName}
          />
        </SwipePanel>
      </SwipeableViews>
    </animated.div>
  );
};

function SwipePanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <>{children}</>}
    </div>
  );
}

export default CallHistory;
