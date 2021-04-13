import React, { useEffect, useState } from "react";
import {
  approvePendingFriendRequest,
  rejectPendingFriendRequest,
  updatePendingFriendRequests,
} from "../../../actions/friendActions";

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



function NotificationBar() {
  const [numberOfPendingFriendRequest, setNumberOfPendingFriendRequest] = useState<number | null>(null);
  const [friendRequestsNotifications, setFriendRequestsNotifications,] = React.useState<any>([]);
  const { user } = useSelector((state) => state.authReducer);
  const { friendRequests } = useSelector((state) => state.friendReducer)
  const dispatch = useDispatch();

  useEffect(() => {
    setFriendRequestsNotifications(friendRequests);
    setNumberOfPendingFriendRequest(friendRequests.length)
  }, [friendRequests]);

  useEffect(() => {
    if (user.email) {
      dispatch(updatePendingFriendRequests())
    }
  }, [user]);

  const clearSpecificFriendRequest = (email: string) => {
    const filteredFriendRequest = friendRequestsNotifications.filter(friendReq => friendReq.email !== email);
    setFriendRequestsNotifications(filteredFriendRequest)
    setNumberOfPendingFriendRequest(filteredFriendRequest.length)
  }
  async function handleApproveFriendShip(userFriendEmail: string) {
    try {
      clearSpecificFriendRequest(userFriendEmail)
      dispatch(
        approvePendingFriendRequest({
          userFriendEmail,
        })
      );

    } catch (e) {
      console.warn(e);
    }
  }

  async function handleRejectFriendShip(userFriendEmail: string) {
    try {
      clearSpecificFriendRequest(userFriendEmail)
      dispatch(
        rejectPendingFriendRequest({
          userEmail: user.email,
          userFriendEmail,
        })
      )

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
          {friendRequestsNotifications.map((friendRequest, index) => {
            const { firstName, lastName, email, imageAddress } = friendRequest;
            return (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar alt={firstName} src={imageAddress} />
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
          })}
        </List>
      </Card>
    </>
  );
}

export default NotificationBar;
