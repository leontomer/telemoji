import React, { useLayoutEffect, useEffect } from "react";
import { useGoogleLogin } from "react-google-login";
import { useDispatch, useSelector } from "react-redux";
import { loginWithGoogle } from "../../../actions/authActions";
import { refreshTokenSetup } from "./RefreshToken";
import { clientId } from "../../../Common/constants";
import { useLoader } from "../../../Contexts/LoaderContext";
import "./GoogleLogin.scss";
import lan from "../../../Languages/Languages.json";

function GoogleLoginHooks({ goToDashboard }) {
  const [language, setLocalLanguage] = React.useState("En");
  // @ts-ignore
  const globalLanguage = useSelector((state) => state.LanguageReducer.language);
  useEffect(() => {
    setLocalLanguage(globalLanguage);
  }, [globalLanguage]);
  const { startLoading, finishLoading } = useLoader();
  // @ts-ignore
  const isAuthenticated = useSelector(
    (state) => state.authReducer.isAuthenticated
  );
  useLayoutEffect(() => {
    if (isAuthenticated) {
      finishLoading();
      goToDashboard();
    }
  }, [isAuthenticated]);

  const dispatch = useDispatch();
  const onSuccess = (res) => {
    dispatch(loginWithGoogle(res.tokenId));
    refreshTokenSetup(res);
  };
  const onFailure = (res) => {
    console.error("login failed: res:", res);
    finishLoading();
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: false,
    accessType: "offline",
  });

  return (
    <button
      onClick={() => {
        startLoading();
        signIn();
      }}
      type="button"
      className="login-with-google-btn"
    >
      {lan[language].google_sign_in}
    </button>
  );
}

export default GoogleLoginHooks;
