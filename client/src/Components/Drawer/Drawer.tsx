import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer } from "../../actions/addonActions";
import { DrawerMenu } from "./DrawerMenu/DrawerMenu";

export function DrawerComponent() {
  const dispatch = useDispatch();
  const [openDrawerState, setOpenDrawerState] = useState(false);
  // @ts-ignore
  const openDrawer = useSelector((state) => state.addonReducer.openDrawer);
  // @ts-ignore
  const userImage = useSelector((state) => state.authReducer.user.imageAddress)
  useEffect(() => {
    setOpenDrawerState(openDrawer);
  }, [openDrawer]);

  const useStyles = makeStyles({
    large: {
      marginTop: 50,
      margin: "auto",
      width: 160,
      height: 160,
      border: '10px solid #E5E8E8',
      marginBottom: '10px'
    }
  });

  const classes = useStyles();
  return (
    <Drawer
      anchor={"right"}
      open={openDrawerState}
      onClose={() => dispatch(closeDrawer())}
    >
      <Avatar
        alt="Remy Sharp"
        src={userImage}
        className={classes.large}
      />
      <DrawerMenu />
    </Drawer>
  );
}
