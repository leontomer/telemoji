import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { Content } from "../../../Common/content";
import { setAbout, setUserImageAction } from "../../../actions/usersActions";
import Sprinkle from "../../../svgs/Sprinkle.svg";
import "./FriendInfoCard.scss";
const useStyles = makeStyles({
  root: {
    width: "100%",
    height: 500,
    backgroundImage: Sprinkle,
    backgroundSize: "cover",
  },
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

interface FriendInfoCardProps {
  friendInFocus: FriendProps | null;
}

export default function FriendInfoCard(props: FriendInfoCardProps) {
  const { friendInFocus: friend } = props;
  const classes = useStyles();
  const [userAbout, setUserAbout] = useState<string>(Content.default_about);
  const [userImage, setUserImage] = useState<string>(Content.default_image);

  const [saveButtonReady, setSaveButtonReady] = useState(true);
  const dispatch = useDispatch();

  const getFriendAbout = () => {
    if (friend && friend.about) {
      return friend.about;
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
        value={userAbout}
        multiline
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
    if (friend && friend.imageAddress) {
      return friend.imageAddress;
    } else {
      return Content.default_image;
    }
  };

  const user = useSelector((state) => state.authReducer.user);
  useEffect(() => {
    if (user) {
      setUserAbout(user.about);
      setUserImage(user.imageAddress);
    }
  }, [user]);

  const getFriendActions = () => {
    return (
      <>
        <Button size="small" color="primary">
          Call
        </Button>
        <Button size="small" color="primary">
          Cool
        </Button>
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
        <Button size="small" color="primary">
          Cool
        </Button>
      </>
    );
  };

  return (
    <div className="outer">
      <Card className="root">
        <Avatar
          alt="Remy Sharp"
          src={getUserImage()}
          className={classes.large}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="h4">
            {friend
              ? `${friend.firstName} ${friend.lastName}`
              : user && `${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {friend ? getFriendAbout() : getUserAbout()}
          </Typography>
        </CardContent>

        <CardActions className={classes.actions}>
          {friend ? getFriendActions() : getUserActions()}
        </CardActions>
      </Card>
    </div>
  );
}
