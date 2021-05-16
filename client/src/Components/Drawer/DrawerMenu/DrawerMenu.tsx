import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { useDispatch } from "react-redux";
import { closeDrawer } from "../../../actions/addonActions";
import LogoutHooks from "./LogoutHooks/LogoutHooks";
import FaceIcon from "@material-ui/icons/Face";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export const DrawerMenu = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  return (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={() => dispatch(closeDrawer())}
      onKeyDown={() => dispatch(closeDrawer())}
    >
      <List>
        <Link to="/self-detection">
          <ListItem button key={"Try your face detection"}>
            <ListItemIcon>
              <FaceIcon />
            </ListItemIcon>
            <ListItemText primary={"face"} />
          </ListItem>
        </Link>

        <Link to="/editDetails">
          <ListItem button key={"editDetails"}>
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary={"Edit Details"} />
          </ListItem>
        </Link>

        {/* {[ "Under construction2", "Under construction3"].map(
          (text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          )
        )} */}
      </List>
      <Divider />
      <List>
        {/* {[
          "Under construction5",
          "Under construction6",
          "Under construction7",
        ].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
        <ListItem>{LogoutHooks()}</ListItem>
      </List>
    </div>
  );
};
