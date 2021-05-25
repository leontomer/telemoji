import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { Content } from "../../../Common/content";
import CardMedia from "@material-ui/core/CardMedia";
import { setAbout, setUserImageAction } from "../../../actions/usersActions";
import lan from "../../../Languages/Languages.json";

import {
  sendFriendRequest,
  removeFriend,
} from "../../../actions/friendActions";
import { useSpring, animated, to } from "@react-spring/web";
import { useGesture } from "react-use-gesture";
import buImage from "../../../svgs/headerbackground.svg";

import "./FriendInfoCard.scss";
import CloudinaryUploadButton from "./CloudinaryIntegration/CloudinaryUploadButton";
const useStyles = makeStyles({
  large: {
    marginTop: -260,
    margin: "auto",
    width: 160,
    height: 160,
    border: "5px solid  #53317e",
  },
  actions: {
    padding: 30,
  },
  media: {
    height: 350,
    zIndex: 100,
  },
});

export default function FriendInfoCard() {
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const classes = useStyles();
  // @ts-ignore
  const user = useSelector((state) => state.authReducer.user);
  // @ts-ignore
  const globalFriendList = useSelector(
    // @ts-ignore
    (state) => state.friendReducer.friendList
  );
  // @ts-ignore
  const _friendInFocus: FriendProps = useSelector(
    // @ts-ignore
    (state) => state.friendReducer.friendInFocus
  );
  const [userAbout, setUserAbout] = useState<string>(Content.default_about);
  const [userImage, setUserImage] = useState<string>(Content.default_image);
  const [friendList, setFriendList] = useState(globalFriendList);
  const [friendInFocus, setFriendInFocus] = useState(_friendInFocus);
  const [saveButtonReady, setSaveButtonReady] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setFriendList(globalFriendList);
  }, [globalFriendList]);

  useEffect(() => {
    setFriendInFocus(_friendInFocus);
  }, [_friendInFocus]);

  const getFriendAbout = () => {
    return (
      <TextField
        style={{ width: "80%", maxHeight: "30px" }}
        value={
          friendInFocus && friendInFocus.about
            ? friendInFocus.about
            : Content.default_about
        }
        multiline
        variant="outlined"
        id="outlined-multiline-static"
        label={lan[language].about}
        rows={4}
        disabled
      />
    );
  };
  const handleAboutChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setUserAbout(value);
  };

  const getUserAbout = () => {
    return (
      <TextField
        style={{ width: "80%", maxHeight: "80px" }}
        value={userAbout}
        multiline
        variant="outlined"
        onChange={handleAboutChange}
        id="outlined-multiline"
        focused
        label={lan[language].about}
        rows={8}
      />
    );
  };

  const getUserImage = () => {
    if (user && user.imageAddress) {
      return user.imageAddress;
    } else {
      return Content.default_image;
    }
  };

  const getFriendImage = () => {
    if (friendInFocus && friendInFocus.imageAddress) {
      return friendInFocus.imageAddress;
    } else {
      return Content.default_image;
    }
  };

  useEffect(() => {
    if (user) {
      setUserAbout(user.about);
      setUserImage(user.imageAddress);
    }
  }, [user]);

  const usersAreFriends = () => {
    if (friendList.length === 0 || !friendInFocus) {
      return false;
    }
    const userFriendListIndex = friendList.find(
      (friend) => friend._id === friendInFocus._id
    );
    return !!userFriendListIndex;
  };

  const handleAddFriend = async () => {
    try {
      await dispatch(sendFriendRequest());
    } catch (error) {
      console.warn(error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await dispatch(removeFriend({ userFriendId: friendInFocus._id }));
    } catch (error) {
      console.warn(error);
    }
  };

  const getFriendActions = () => {
    return (
      <>
        {usersAreFriends() ? (
          <Button size="small" color="primary" onClick={handleUnfriend}>
            {lan[language].unfriend}
          </Button>
        ) : (
          <Button size="small" color="primary" onClick={handleAddFriend}>
            {lan[language].add_friend}
          </Button>
        )}
      </>
    );
  };
  const handleSaveUserDetails = async () => {
    setSaveButtonReady(false);
    try {
      await dispatch(setAbout({ id: user._id, about: userAbout }));
    } catch (error) {
      console.error(error);
    } finally {
      setSaveButtonReady(true);
    }
  };

  const getUserActions = () => {
    return (
      <>
        <Button
          size="small"
          color="primary"
          disabled={!saveButtonReady}
          onClick={handleSaveUserDetails}
          style={{ height: "25px" }}
        >
          {lan[language].profile_save}
        </Button>
      </>
    );
  };

  const domTarget = React.useRef(null);
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

  const [wheelApi] = useSpring(() => ({ wheelY: 0 }));

  useGesture(
    {
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api.start({
          scale: 1.05,
        }),
      onHover: ({ hovering }) =>
        !hovering && api.start({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { domTarget, eventOptions: { passive: false } }
  );

  return (
    <animated.div
      className="outer"
      ref={domTarget}
      style={{
        transform: "perspective(600px)",
        scale: to([scale, zoom], (s, z) => s + z),
        rotateX,
        rotateY,
        rotateZ,
      }}
    >
      <Card className="root">
        <CardMedia
          className={classes.media}
          image={buImage}
          title="Contemplative Reptile"
        />
        <>
          <Avatar
            alt="Remy Sharp"
            src={friendInFocus ? getFriendImage() : getUserImage()}
            className={classes.large}
          />
          <Typography
            gutterBottom
            variant="h4"
            component="h4"
            style={{ textAlign: "center" }}
          >
            {friendInFocus
              ? `${friendInFocus.firstName} ${friendInFocus.lastName}`
              : user && `${user.firstName} ${user.lastName}`}
          </Typography>
        </>

        <CardContent>
          <>{friendInFocus ? getFriendAbout() : getUserAbout()}</>
        </CardContent>
        <CardActions className={classes.actions} style={{ marginTop: "80px" }}>
          {friendInFocus ? getFriendActions() : getUserActions()}
        </CardActions>
      </Card>
    </animated.div>
  );
}
