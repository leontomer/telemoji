import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PhoneIcon from "@material-ui/icons/Phone";
import IconButton from "@material-ui/core/IconButton";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import Avatar from "@material-ui/core/Avatar";
import { green, grey } from "@material-ui/core/colors";
import { FriendProps, getFriends, getImageAddress } from "../Dashboard.api";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import { ListItemIcon } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { Link } from "react-router-dom";

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
  const friends = getFriends();

  const handleFriendClick = (friend: FriendProps) => {
    setFriendInFocus(friend);
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
      {friends.map((friend, index) => {
        const labelId = `checkbox-list-secondary-label-${friend}`;
        return (
          <ListItem
            key={index}
            button
            onClick={() => handleFriendClick(friend)}
          >
            <ListItemAvatar>
              <Avatar alt={`${friend.name}`} src={friend.imageAddress} />
            </ListItemAvatar>
            <ListItemText id={labelId} primary={friend.name} />
            <ListItemSecondaryAction>
              <Tooltip placement="right" arrow title="Click to show details">
                <IconButton>
                  <InfoOutlinedIcon />
                </IconButton>
              </Tooltip>
              <IconButton disabled={!friend.available}>
                <Link to="/video-chat">
                  <PhoneIcon
                    style={
                      friend.available
                        ? { color: green[500] }
                        : { color: grey[500] }
                    }
                  />
                </Link>
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}
