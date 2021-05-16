import React, { useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import PhoneIcon from "@material-ui/icons/Phone";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { green, grey } from "@material-ui/core/colors";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { ListItemIcon, withStyles } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { useDispatch, useSelector } from "react-redux";
import { getFriendList, setFriendInFocus } from "../../../actions/friendActions";
import { FriendProps } from "../../../reducers/authReducer";
import { handleCallUser } from "../../../actions/callActions";
import { withRouter } from "react-router";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
      position: "relative",
      overflow: "auto",
      height: "100%",
      boxShadow: '0px 0px 19px 3px rgba(0, 0, 0, 0.5)',
    },
    listSection: {
      backgroundColor: "inherit",
    },
    ul: {
      backgroundColor: "inherit",
      padding: 0,
    },
    onlineBadge: {
      backgroundColor: "green",
    },
    offlineBadge: {
      backgroundColor: "red",
    },
    title: {
      backgroundColor: '#53317e',
      color: 'white',
      marginTop: '-10px',
      marginBottom: '5px'
    }
  })
);

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: -1,
      left: -1,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const StyledInCallBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#E67E22',
    color: '#E67E22',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: -1,
      left: -1,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

function FriendsList({ history }) {
  const classes = useStyles();
  // @ts-ignore
  const { user } = useSelector((state) => state.authReducer);
  // @ts-ignore
  const { friendList: globalFriendList } = useSelector((state) => state.friendReducer);
  // @ts-ignore
  const allConnectedUsers = useSelector((state) => state.socketReducer.allConnectedUsers)

  const [userFriendList, setUserFriendList] = useState([]);
  const [connectedUsers, setConnectedUsers] = useState(allConnectedUsers)

  useEffect(() => {
    setConnectedUsers(allConnectedUsers)
  }, [allConnectedUsers])

  const handleFriendClick = (friend: FriendProps) => {
    dispatch(setFriendInFocus(friend));
  };

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (user) {
        await dispatch(getFriendList());
      }
    })();
  }, [user]);

  useEffect(() => {
    setUserFriendList(globalFriendList)
  }, [globalFriendList])

  const handleCall = (id) => {
    dispatch(handleCallUser(id));
    history.push(`/video-chat/${id}`);
  };

  return (
    <List dense className={classes.root}>
      <ListItem key={"myFriends"} className={classes.title}>
        <ListItemIcon>
          <PeopleAltIcon style={{ color: 'white' }} />
        </ListItemIcon>
        <ListItemText
          primary="Friends"
          secondary={<Typography variant="subtitle2" style={{ color: '#F5EEF8' }}>You can see all your friends here!</Typography>}
        />
      </ListItem>
      {
        userFriendList.map((friend: FriendProps, index) => {
          const labelId = `checkbox-list-secondary-label-${friend}`;
          return (
            <ListItem
              key={index}
              button
              onClick={() => handleFriendClick(friend)}
            >

              <ListItemAvatar>
                {
                  connectedUsers[friend._id] ?
                    connectedUsers[friend._id].inCall ? (
                      <StyledInCallBadge
                        overlap="circle"
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        variant="dot"
                      >
                        <Avatar alt={`${friend.firstName}`} src={friend.imageAddress} />
                      </StyledInCallBadge>
                    ) :
                      (
                        <StyledBadge
                          overlap="circle"
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                          }}
                          variant="dot"
                        >
                          <Avatar alt={`${friend.firstName}`} src={friend.imageAddress} />
                        </StyledBadge>
                      ) :
                    (<Badge invisible={false} variant="dot" anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }} classes={{ badge: classes.offlineBadge }} overlap="circle" >
                      <Avatar alt={`${friend.firstName}`} src={friend.imageAddress} />
                    </Badge>)
                }
              </ListItemAvatar>


              <ListItemText id={labelId} primary={friend.firstName} />
              <ListItemSecondaryAction>
                <IconButton
                  disabled={!connectedUsers[friend._id] || connectedUsers[friend._id].inCall}
                  onClick={() => handleCall(friend._id)}
                >
                  <PhoneIcon
                    style={
                      connectedUsers[friend._id]
                        ? { color: green[500] }
                        : { color: grey[500] }
                    }
                  />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })
      }
    </List>
  );
}
export default withRouter(FriendsList);
