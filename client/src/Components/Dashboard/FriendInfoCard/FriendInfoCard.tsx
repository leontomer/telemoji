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
import {
  setAbout,
  setUserImageAction,
} from "../../../actions/usersActions";
import {
  sendFriendRequest,
  removeFriend
} from '../../../actions/friendActions';

import "./FriendInfoCard.scss";
const useStyles = makeStyles({
  large: {
    marginTop: 50,
    margin: "auto",
    width: 200,
    height: 200,
  },
  actions: {
    padding: 30,
  },
});

export default function FriendInfoCard() {
  const classes = useStyles();

  const user = useSelector((state) => state.authReducer.user);
  const globalFriendList = useSelector((state) => state.friendReducer.friendList);
  const friendInFocus: FriendProps = useSelector(
    (state) => state.friendReducer.friendInFocus
  );

  const [userAbout, setUserAbout] = useState<string>(Content.default_about);
  const [userImage, setUserImage] = useState<string>(Content.default_image);
  const [friendList, setFriendList] = useState(globalFriendList)

  const [saveButtonReady, setSaveButtonReady] = useState(true);
  const dispatch = useDispatch();


  useEffect(() => {
    setFriendList(globalFriendList);
  }, [globalFriendList])

  const getFriendAbout = () => {
    if (friendInFocus && friendInFocus.about) {
      return friendInFocus.about;
    } else {
      return Content.default_about;
    }
  };
  const handleAboutChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setUserAbout(value);
  };

  const handleImageChange = ({
    target: { value },
  }: {
    target: { value: string };
  }) => {
    setUserImage(value);
  };

  const getUserAbout = () => {
    return (
      <TextField
        style={{ width: "80%", maxHeight: "80px" }}
        value={userAbout}
        multiline
        rowsMax={4}
        variant="outlined"
        onChange={handleAboutChange}
      />
    );
  };

  const setImage = () => {
    return (
      <TextField
        label="Image"
        value={userImage}
        variant="outlined"
        onChange={handleImageChange}
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
    const userFriendListIndex = friendList.find(friend => friend._id === friendInFocus._id);
    return !!userFriendListIndex;
  };

  const handleAddFriend = async () => {
    try {
      await dispatch(
        sendFriendRequest()
      );
    } catch (error) {
      console.warn(error);
    }
  };

  const handleUnfriend = async () => {
    try {
      await dispatch(
        removeFriend({ userFriendId: friendInFocus._id })
      );
    } catch (error) {
      console.warn(error);
    }
  };

  const getFriendActions = () => {
    return (
      <>
        <Button size="small" color="primary">
          Call
        </Button>
        {usersAreFriends() ? (
          <Button size="small" color="primary" onClick={handleUnfriend}>
            Unfriend
          </Button>
        ) : (
            <Button size="small" color="primary" onClick={handleAddFriend}>
              Add Friend
            </Button>
          )}
      </>
    );
  };
  const handleSaveUserDetails = async () => {
    setSaveButtonReady(false);
    try {
      await dispatch(setAbout({ id: user._id, about: userAbout }));
      await dispatch(setUserImageAction({ id: user._id, imgAdrss: userImage }));
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
        >
          Save
        </Button>
      </>
    );
  };

  return (
    <div className="outer">
      <Card className="root">
        {friendInFocus ? (
          <Avatar
            alt="Remy Sharp"
            src={getFriendImage()}
            className={classes.large}
          />
        ) : (
            <div>
              <Avatar
                alt="Remy Sharp"
                src={getUserImage()}
                className={classes.large}
              />
              <TextField
                label="Image"
                value={userImage}
                variant="outlined"
                onChange={handleImageChange}
              />
            </div>
          )}

        <CardContent>
          <Typography gutterBottom variant="h4" component="h4">
            {friendInFocus
              ? `${friendInFocus.firstName} ${friendInFocus.lastName}`
              : user && `${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {friendInFocus ? getFriendAbout() : getUserAbout()}
          </Typography>
        </CardContent>
        <CardActions className={classes.actions}>
          {friendInFocus ? getFriendActions() : getUserActions()}
        </CardActions>
      </Card>
    </div>
  );
}
