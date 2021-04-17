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
        {["Under construction", "Under construction", "Under construction", "Under construction"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["Under construction", "Under construction", "Under construction"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
        <ListItem>{LogoutHooks()}</ListItem>
      </List>
    </div>
  );
};
