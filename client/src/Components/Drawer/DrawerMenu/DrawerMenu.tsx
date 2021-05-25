import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import MailIcon from "@material-ui/icons/Mail";
import { closeDrawer } from "../../../actions/addonActions";
import LogoutHooks from "./LogoutHooks/LogoutHooks";
import FaceIcon from "@material-ui/icons/Face";
import { Link } from "react-router-dom";
import EditIcon from "@material-ui/icons/Edit";
import InfoIcon from "@material-ui/icons/Info";
import { useDispatch, useSelector } from "react-redux";
import lan from "../../../Languages/Languages.json";
import ContactSupportIcon from "@material-ui/icons/ContactSupport";
import { purple } from "@material-ui/core/colors";
const useStyles = makeStyles({
  list: {
    width: 250,
  },
});

export const DrawerMenu = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
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
              <FaceIcon color={"primary"} />
            </ListItemIcon>
            <ListItemText primary={lan[language].nav_face} />
          </ListItem>
        </Link>

        <Link to="/editDetails">
          <ListItem button key={"editDetails"}>
            <ListItemIcon>
              <EditIcon color={"primary"} />
            </ListItemIcon>
            <ListItemText primary={lan[language].nav_edit} />
          </ListItem>
        </Link>

        <Link to="/contactUs">
          <ListItem button key={"editDetails"}>
            <ListItemIcon>
              <ContactSupportIcon color={"primary"} />
            </ListItemIcon>
            <ListItemText primary={lan[language].nav_contact} />
          </ListItem>
        </Link>

        <Link to="/aboutUs">
          <ListItem button key={"editDetails"}>
            <ListItemIcon>
              <InfoIcon color={"primary"} />
            </ListItemIcon>
            <ListItemText primary={lan[language].nav_about} />
          </ListItem>
        </Link>
      </List>
      <Divider />
      <List>
        <ListItem>{LogoutHooks()}</ListItem>
      </List>
    </div>
  );
};
