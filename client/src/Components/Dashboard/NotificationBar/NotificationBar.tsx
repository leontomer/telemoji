import React, { useEffect, useState } from "react";
import {
  approvePendingFriendRequest,
  rejectPendingFriendRequest,
  updatePendingFriendRequests,
} from "../../../actions/usersActions";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
  Card,
} from "@material-ui/core";

interface NotificationBarProps {
  numberOfPendingFriendRequest: number;
}

function NotificationBar(props: NotificationBarProps) {
  const [
    numberOfPendingFriendRequest,
    setNumberOfPendingFriendRequest,
  ] = useState<number | null>(null);

  const { user, friendRequests } = useSelector((state) => state.authReducer);

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      if (user) {
        const requestCount = await dispatch(
          updatePendingFriendRequests(user.email)
        );
      }
      setNumberOfPendingFriendRequest(friendRequests.length);
    })();
  }, [user, friendRequests]);

  async function handleApproveFriendShip(userFriendEmail: string) {
    try {
      dispatch(
        await approvePendingFriendRequest({
          userEmail: user.email,
          userFriendEmail,
        })
      );
      dispatch(updatePendingFriendRequests(user.email));
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleRejectFriendShip(userFriendEmail: string) {
    try {
      dispatch(
        await rejectPendingFriendRequest({
          userEmail: user.email,
          userFriendEmail,
        })
      );
      dispatch(updatePendingFriendRequests(user.email));
    } catch (e) {
      console.warn(e);
    }
  }

  return (
    <>
      <Card>
        <List dense>
          <ListItem key={"myFriends"}>
            <ListItemIcon>
              <PeopleAltIcon />
            </ListItemIcon>
            <ListItemText
              primary="Friend Requests"
              secondary={`Number of pending friend request :${numberOfPendingFriendRequest}`}
            />
          </ListItem>
          <Divider />
          {numberOfPendingFriendRequest !== 0 ? (
            friendRequests.map((friendRequest, index) => {
              const { firstName, lastName, email } = friendRequest;
              return (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar alt={firstName} src="/static/images/avatar/1.jpg" />
                  </ListItemAvatar>
                  <ListItemText primary={`${firstName} ${lastName}`} />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => handleApproveFriendShip(email)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleRejectFriendShip(email)}>
                      <RemoveIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })
          ) : (
            <div></div>
          )}
        </List>
      </Card>
    </>
  );
}

export default NotificationBar;
