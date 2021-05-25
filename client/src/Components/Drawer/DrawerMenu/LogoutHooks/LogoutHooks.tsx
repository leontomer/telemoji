import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { logout } from "../../../../actions/authActions";
import { useGoogleLogout } from "react-google-login";
import { clientId } from "../../../../Common/constants";
import lan from "../../../../Languages/Languages.json";
import { purple } from "@material-ui/core/colors";

export default function LogoutHooks() {
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  const [language, setLocalLanguage] = React.useState(globalLanguage);

  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);

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
        background: purple[800],
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
      {lan[language].logout}
    </Button>
  );
}
