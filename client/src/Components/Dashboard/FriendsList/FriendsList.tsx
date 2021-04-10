import React, { useEffect } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PhoneIcon from "@material-ui/icons/Phone";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import { green, grey } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ListItemIcon } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList, setFriendInFocus } from "../../../actions/friendActions";
import { FriendProps } from "../../../reducers/authReducer";
import { handleCallUser } from "../../../actions/callActions";
import { withRouter } from "react-router";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      height: "100%",
    },
    listSection: {
      backgroundColor: "inherit",
    },
    ul: {
      backgroundColor: "inherit",
      padding: 0,
    },
  })
);

function FriendsList({ history }) {
  const classes = useStyles();
  const { user, friendList } = useSelector((state) => state.authReducer);

  const handleFriendClick = (friend: FriendProps) => {
    dispatch(setFriendInFocus(friend));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (user) {
        await dispatch(getFriendList(user.email));
      }
    })();
  }, [user, friendList]);

  const handleCall = (id) => {
    dispatch(handleCallUser(id));
    history.push(`/video-chat/${id}`);
  };

  return (
    <List dense className={classes.root}>
      <ListItem key={"myFriends"}>
        <ListItemIcon>
          <PeopleAltIcon />
        </ListItemIcon>
        <ListItemText
          primary="Friends"
          secondary="You can see all your friends here!"
        />
      </ListItem>
      <Divider />
      {friendList.length !== 0 ? (
        friendList.map((friend: FriendProps, index) => {
          const labelId = `checkbox-list-secondary-label-${friend}`;
          return (
            <ListItem
              key={index}
              button
              onClick={() => handleFriendClick(friend)}
            >
              <ListItemAvatar>
                <Avatar alt={`${friend.firstName}`} src={friend.imageAddress} />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={friend.firstName} />
              <ListItemSecondaryAction>
                <IconButton
                  disabled={false}
                  onClick={() => handleCall(friend._id)}
                >
                  <PhoneIcon
                    style={
                      friend.firstName === "tom"
                        ? { color: green[500] }
                        : { color: grey[500] }
                    }
                  />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      ) : (
          <></>
        )}
    </List>
  );
}
export default withRouter(FriendsList);
