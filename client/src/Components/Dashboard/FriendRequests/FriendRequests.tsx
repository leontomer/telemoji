import React, { useState, useEffect } from "react";
import Popover from "@material-ui/core/Popover";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import IconButton from '@material-ui/core/IconButton';
import NotificationBar from "../NotificationBar/NotificationBar";
import Badge from '@material-ui/core/Badge';
import { useDispatch, useSelector } from "react-redux";
import { updatePendingFriendRequests } from '../../../actions/friendActions';


export default function FriendRequests() {

  const dispatch = useDispatch();
  const friendRequestsGlobal = useSelector((state) => state.friendReducer.friendRequests)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [friendRequest, setFriendRequests] = useState(friendRequestsGlobal);

  useEffect(() => {
    dispatch(updatePendingFriendRequests());
  }, []);

  useEffect(() => {
    setFriendRequests(friendRequestsGlobal)
  }, [friendRequestsGlobal])

  return (
    <div>
      <Badge badgeContent={friendRequest.length} color="primary" overlap="circle" style={{ marginRight: 10 }} >
        <IconButton
          style={{ backgroundColor: 'white', color: 'rgb(83,49,126)' }}
          onClick={handleClick}
        >
          <SupervisorAccountIcon />
        </IconButton>
      </Badge>


      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <NotificationBar />
      </Popover>
    </div>
  );
}
