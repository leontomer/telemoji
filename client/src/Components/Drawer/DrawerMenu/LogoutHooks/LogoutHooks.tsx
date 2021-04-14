import React from "react";
import { useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { logout } from "../../../../actions/authActions";
import { useGoogleLogout } from "react-google-login";
import { clientId } from "../../../../Common/constants";

export default function LogoutHooks() {
  const dispatch = useDispatch();
  const onLogoutSuccess = () => {};
  const onFailure = () => {
    console.log("failed");
  };

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess,
    onFailure,
  });

  return (
    <Button
      style={{
        background: "  #ec7063  ",
        color: "white",
        fontWeight: "bold",
        margin: "auto",
        marginTop: 20,
      }}
      onClick={() => {
        signOut();
        dispatch(logout());
      }}
    >
      Logout
    </Button>
  );
}