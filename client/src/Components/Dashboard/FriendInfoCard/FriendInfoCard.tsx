import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FriendProps } from "../../../reducers/authReducer";
import { useDispatch, useSelector } from "react-redux";
import TextField from "@material-ui/core/TextField";
import { Content } from "../../../Common/content";
import { setAbout } from "../../../actions/usersActions";

const useStyles = makeStyles({
  root: {
    width: "100%",
    height: "100%",
  },
});

interface FriendInfoCardProps {
  friendInFocus: FriendProps | null;
}

export default function FriendInfoCard(props: FriendInfoCardProps) {
  const { friendInFocus: friend } = props;
  const classes = useStyles();
  const [userAbout, setUserAbout] = useState<string>(Content.default_about);
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

  const getUserAbout = () => {
    return (
      <TextField
        label="About"
        value={userAbout}
        multiline
        variant="outlined"
        onChange={handleAboutChange}
      />
    );
  };

  const user = useSelector((state) => state.authReducer.user);
  useEffect(() => {
    if (user) {
      setUserAbout(user.about);
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
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          image="https://media-exp1.licdn.com/dms/image/C4D03AQHniuo3G89_ww/profile-displayphoto-shrink_200_200/0/1595252175666?e=1619654400&v=beta&t=hqgjfoU_0yRUH7h0qSqzb4ENw_p9EC_0lwIeCuDHhhU"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {friend
              ? `${friend.firstName} ${friend.lastName}`
              : user && `${user.firstName} ${user.lastName}`}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {friend ? getFriendAbout() : getUserAbout()}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        {friend ? getFriendActions() : getUserActions()}
      </CardActions>
    </Card>
  );
}
