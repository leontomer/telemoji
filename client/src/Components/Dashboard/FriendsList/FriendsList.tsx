import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList } from "../../../actions/usersActions";
import { FriendProps } from "../../../reducers/authReducer";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      height: "95vh",
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

interface FriendsListProps {
  setFriendInFocus: any;
}

export default function FriendsList(props: FriendsListProps) {
  const { setFriendInFocus } = props;
  const classes = useStyles();
  const { user, friendList } = useSelector((state) => state.authReducer);

  const handleFriendClick = (friend: FriendProps) => {
    setFriendInFocus(friend);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (user) {
        await dispatch(getFriendList(user.email));
      }
    })();
  }, [friendList, user]);

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
        friendList.map((friend, index) => {
          const labelId = `checkbox-list-secondary-label-${friend}`;
          return (
            <ListItem
              key={index}
              button
              onClick={() => handleFriendClick(friend)}
            >
              <ListItemAvatar>
                <Avatar
                  alt={`${friend.firstName}`}
                  //TODO : replace with real picture mechanism
                  src={
                    "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=10208010756503779&height=50&width=50&ext=1619626020&hash=AeS9WAo3l4oE8QEMYPQ"
                  }
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={friend.firstName} />
              <ListItemSecondaryAction>
                <IconButton disabled={false}>
                  <Link to="/video-chat">
                    <PhoneIcon
                      style={
                        friend.firstName === "tom"
                          ? { color: green[500] }
                          : { color: grey[500] }
                      }
                    />
                  </Link>
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
