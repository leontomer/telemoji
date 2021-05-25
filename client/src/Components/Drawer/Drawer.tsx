import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer } from "../../actions/addonActions";
import { DrawerMenu } from "./DrawerMenu/DrawerMenu";
import CloudinaryUploadButton from "../Dashboard/FriendInfoCard/CloudinaryIntegration/CloudinaryUploadButton";

export function DrawerComponent() {
  const dispatch = useDispatch();
  const [openDrawerState, setOpenDrawerState] = useState(false);
  // @ts-ignore
  const openDrawer = useSelector((state) => state.addonReducer.openDrawer);
  // @ts-ignore
  const userImage = useSelector((state) => state.authReducer.user.imageAddress);
  useEffect(() => {
    setOpenDrawerState(openDrawer);
  }, [openDrawer]);

  const useStyles = makeStyles({
    large: {
      marginTop: 50,
      margin: "auto",
      width: 160,
      height: 160,
      border: "10px solid #E5E8E8",
      marginBottom: "10px",
    },
    badge: {
      marginLeft: 60,
      marginTop: 170,
      position:'absolute',
      zIndex:200
    },
  });

  const classes = useStyles();
  return (
    <Drawer
      anchor={"right"}
      open={openDrawerState}
      onClose={() => dispatch(closeDrawer())}
    >
      <Avatar alt="Remy Sharp" src={userImage} className={classes.large} />
      <Badge className={classes.badge}>
        <CloudinaryUploadButton />
      </Badge>
      <DrawerMenu />
    </Drawer>
  );
}
