import React, { useEffect, useState } from "react";
import {
  approvePendingFriendRequest,
  rejectPendingFriendRequest,
  updatePendingFriendRequests,
} from "../../../actions/friendActions";

import { useDispatch, useSelector } from "react-redux";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import lan from "../../../Languages/Languages.json";
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
  const [numberOfPendingFriendRequest, setNumberOfPendingFriendRequest] =
    useState<number>(0);
  const [friendRequestsNotifications, setFriendRequestsNotifications] =
    React.useState<any>([]);
  // @ts-ignore
  const { user } = useSelector((state) => state.authReducer);
  // @ts-ignore
  const { friendRequests } = useSelector((state) => state.friendReducer);
  const dispatch = useDispatch();

  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

  useEffect(() => {
    setFriendRequestsNotifications(friendRequests);
    setNumberOfPendingFriendRequest(friendRequests.length);
  }, [friendRequests]);

  useEffect(() => {
    if (user.email) {
      dispatch(updatePendingFriendRequests());
    }
  }, [user]);

  const clearSpecificFriendRequest = (email: string) => {
    const filteredFriendRequest = friendRequestsNotifications.filter(
      (friendReq) => friendReq.email !== email
    );
    setFriendRequestsNotifications(filteredFriendRequest);
    setNumberOfPendingFriendRequest(filteredFriendRequest.length);
  };
  async function handleApproveFriendShip(userFriendEmail: string) {
    try {
      dispatch(
        approvePendingFriendRequest({
          userFriendEmail,
        })
      );
      clearSpecificFriendRequest(userFriendEmail);
    } catch (e) {
      console.warn(e);
    }
  }

  async function handleRejectFriendShip(userFriendEmail: string) {
    try {
      dispatch(
        rejectPendingFriendRequest({
          userFriendEmail,
        })
      );
      clearSpecificFriendRequest(userFriendEmail);
    } catch (e) {
      console.log("error reject is", e);
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
              primary={lan[language].friend_requests_text}
              secondary={
                numberOfPendingFriendRequest > 0
                  ? `${lan[language].friend_requests}${numberOfPendingFriendRequest}`
                  : lan[language].no_friend_requests
              }
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
                    <CheckIcon style={{ color: "green" }} />
                  </IconButton>
                  <IconButton onClick={() => handleRejectFriendShip(email)}>
                    <ClearIcon style={{ color: "red" }} />
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
