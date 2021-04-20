import React, { useEffect, useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import { useSelector, useDispatch } from "react-redux";
import { closeDrawer } from "../../actions/addonActions";
import { DrawerMenu } from "./DrawerMenu/DrawerMenu";

export function DrawerComponent() {
  const dispatch = useDispatch();
  const [openDrawerState, setOpenDrawerState] = useState(false);
  // @ts-ignore
  const openDrawer = useSelector((state) => state.addonReducer.openDrawer);
  useEffect(() => {
    setOpenDrawerState(openDrawer);
  }, [openDrawer]);
  return (
    <Drawer
      anchor={"right"}
      open={openDrawerState}
      onClose={() => dispatch(closeDrawer())}
    >
      <DrawerMenu />
    </Drawer>
  );
}
